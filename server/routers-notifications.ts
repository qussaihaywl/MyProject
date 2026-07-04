import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { notifications, users } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const notificationsRouter = router({
  // الحصول على إشعارات المستخدم
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      
      const whereConditions = input.unreadOnly
        ? and(
            eq(notifications.userId, ctx.user.id),
            eq(notifications.isRead, false)
          )
        : eq(notifications.userId, ctx.user.id);

      const notifs = await db
        .select()
        .from(notifications)
        .where(whereConditions)
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        notifications: notifs,
        total: notifs.length,
        unreadCount: notifs.filter((n) => !n.isRead).length,
      };
    }),

  // وضع علامة على الإشعار كمقروء
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const notif = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.notificationId));

      if (!notif[0] || notif[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, input.notificationId));

      return { success: true };
    }),

  // وضع علامة على جميع الإشعارات كمقروءة
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  // حذف الإشعار
  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const notif = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.notificationId));

      if (!notif[0] || notif[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db
        .delete(notifications)
        .where(eq(notifications.id, input.notificationId));

      return { success: true };
    }),

  // حذف جميع الإشعارات
  deleteAllNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    await db
      .delete(notifications)
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  // إرسال إشعار (للمسؤولين فقط)
  sendNotification: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        title: z.string(),
        message: z.string(),
        type: z.enum(["order", "message", "promotion", "system"]),
        link: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // التحقق من أن المستخدم مسؤول
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id));

      if (!user[0] || user[0].role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // إنشاء الإشعار
      await db.insert(notifications).values({
        userId: input.userId,
        title: input.title,
        content: input.message,
        type: input.type as any,
        actionUrl: input.link,
        isRead: false,
      });

      return { success: true };
    }),

  // إرسال إشعار جماعي (للمسؤولين فقط)
  sendBulkNotification: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.number()),
        title: z.string(),
        message: z.string(),
        type: z.enum(["order", "message", "promotion", "system"]),
        link: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // التحقق من أن المستخدم مسؤول
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id));

      if (!user[0] || user[0].role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // إنشاء الإشعارات
      const notificationValues = input.userIds.map((userId) => ({
        userId,
        title: input.title,
        content: input.message,
        type: input.type as any,
        actionUrl: input.link,
        isRead: false,
      }));

      await db.insert(notifications).values(notificationValues);

      return { success: true, count: input.userIds.length };
    }),
});
