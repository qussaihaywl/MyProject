import { router, protectedProcedure, publicProcedure, adminProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { discountCodes, users } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const couponsRouter = router({
  // الحصول على جميع الكوبونات (للمسؤولين فقط)
  getAllCoupons: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const coupons = await db
        .select()
        .from(discountCodes)
        .orderBy(desc(discountCodes.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return coupons;
    }),

  // الحصول على كوبون واحد
  getCouponByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const coupon = await db
        .select()
        .from(discountCodes)
        .where(eq(discountCodes.code, input.code));

      if (!coupon[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Coupon not found",
        });
      }

      return coupon[0];
    }),

  // إنشاء كوبون جديد (للمسؤولين فقط)
  createCoupon: adminProcedure
    .input(
      z.object({
        code: z.string(),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.string(),
        minOrderAmount: z.string().optional(),
        maxDiscount: z.string().optional(),
        usageLimit: z.number().optional(),
        usagePerUser: z.number().default(1),
        applicableCategories: z.string().optional(),
        applicableProducts: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(discountCodes).values({
        code: input.code,
        description: input.description,
        discountType: input.discountType,
        discountValue: input.discountValue,
        minOrderAmount: input.minOrderAmount,
        maxDiscount: input.maxDiscount,
        usageLimit: input.usageLimit,
        usagePerUser: input.usagePerUser,
        applicableCategories: input.applicableCategories,
        applicableProducts: input.applicableProducts,
        startDate: input.startDate,
        endDate: input.endDate,
        isActive: input.isActive,
      });

      return { success: true, couponId: result[0] };
    }),

  // تحديث كوبون (للمسؤولين فقط)
  updateCoupon: adminProcedure
    .input(
      z.object({
        code: z.string(),
        description: z.string().optional(),
        discountValue: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]).optional(),
        usageLimit: z.number().min(1).optional(),
        endDate: z.date().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(discountCodes)
        .set({
          description: input.description,
          discountValue: input.discountValue,
          discountType: input.discountType,
          usageLimit: input.usageLimit,
          endDate: input.endDate,
          isActive: input.isActive,
        })
        .where(eq(discountCodes.code, input.code));

      return { success: true };
    }),

  // حذف كوبون (للمسؤولين فقط)
  deleteCoupon: adminProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(discountCodes).where(eq(discountCodes.code, input.code));

      return { success: true };
    }),
});
