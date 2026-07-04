import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
// استيراد الصلاحيات - سيتم تحديثه بعد إصلاح المسار
// import { isRoleHigherThan, type UserRole } from "../../../shared/roles";

// تعريف مؤقت للأدوار
type UserRole = 'admin' | 'supervisor' | 'delegate' | 'user';

const isRoleHigherThan = (role1: UserRole, role2: UserRole): boolean => {
  const hierarchy: Record<UserRole, number> = {
    admin: 4,
    supervisor: 3,
    delegate: 2,
    user: 1,
  };
  return hierarchy[role1] > hierarchy[role2];
};

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

// إنشاء procedure بصلاحيات محددة
export function createRoleBasedProcedure(minRole: UserRole) {
  return t.procedure.use(
    t.middleware(async opts => {
      const { ctx, next } = opts;

      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
      }

      if (!isRoleHigherThan(ctx.user.role as UserRole, minRole) && ctx.user.role !== minRole) {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية كافية لتنفيذ هذا الإجراء" });
      }

      return next({
        ctx: {
          ...ctx,
          user: ctx.user,
        },
      });
    }),
  );
}

// Procedures بصلاحيات محددة
export const supervisorProcedure = createRoleBasedProcedure('supervisor');
export const delegateProcedure = createRoleBasedProcedure('delegate');
