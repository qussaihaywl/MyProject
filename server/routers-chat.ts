import { router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { messages, users } from "../drizzle/schema";
import { eq, desc, gte } from "drizzle-orm";

export const chatRouter = router({
  // Get chat messages with pagination
  getMessages: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }: { input: any }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const messageList = await db
        .select()
        .from(messages)
        .where(eq(messages.roomId, input.roomId))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return messageList.reverse();
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      if (!ctx.user?.id) throw new Error("Not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .insert(messages)
        .values({
          roomId: input.roomId,
          userId: ctx.user.id,
          userName: ctx.user.name || "Anonymous",
          content: input.content,
          createdAt: new Date(),
        });

      return { success: true, id: result[0] };
    }),

  // Delete a message (only admin or message owner)
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      if (!ctx.user?.id) throw new Error("Not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const message = await db
        .select()
        .from(messages)
        .where(eq(messages.id, input.messageId));

      if (!message[0]) throw new Error("Message not found");

      if (ctx.user.id !== message[0].userId && ctx.user.role !== "admin") {
        throw new Error("Not authorized");
      }

      await db.delete(messages).where(eq(messages.id, input.messageId));

      return { success: true };
    }),

  // Edit a message (only admin or message owner)
  editMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      if (!ctx.user?.id) throw new Error("Not authenticated");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const message = await db
        .select()
        .from(messages)
        .where(eq(messages.id, input.messageId));

      if (!message[0]) throw new Error("Message not found");

      if (ctx.user.id !== message[0].userId && ctx.user.role !== "admin") {
        throw new Error("Not authorized");
      }

      await db
        .update(messages)
        .set({ content: input.content })
        .where(eq(messages.id, input.messageId));

      return { success: true };
    }),

  // Get online users count
  getOnlineUsersCount: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const onlineUsers = await db
      .select({ count: users.id })
      .from(users)
      .where(gte(users.lastActivityAt, fiveMinutesAgo));

    return onlineUsers.length;
  }),

  // Mark user as online
  markAsOnline: protectedProcedure.mutation(async ({ ctx }: { ctx: any }) => {
    if (!ctx.user?.id) throw new Error("Not authenticated");

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(users)
      .set({ lastActivityAt: new Date() })
      .where(eq(users.id, ctx.user.id));

    return { success: true };
  }),

  // Get chat statistics (admin only)
  getChatStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const totalMessages = await db.select({ count: messages.id }).from(messages);

    const messagesLast24h = await db
      .select({ count: messages.id })
      .from(messages)
      .where(gte(messages.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

    const activeUsers = await db
      .select({ userId: messages.userId })
      .from(messages)
      .where(gte(messages.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

    const uniqueActiveUsers = new Set(activeUsers.map((m: any) => m.userId)).size;

    return {
      totalMessages: totalMessages.length,
      messagesLast24h: messagesLast24h.length,
      activeUsersLast24h: uniqueActiveUsers,
    };
  }),

  // Clear chat history (admin only)
  clearChatHistory: adminProcedure
    .input(z.object({ olderThanDays: z.number().default(30) }))
    .mutation(async ({ input }: { input: any }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const cutoffDate = new Date(Date.now() - input.olderThanDays * 24 * 60 * 60 * 1000);

      await db.delete(messages).where(gte(messages.createdAt, cutoffDate));

      return { success: true };
    }),
});
