import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  groupChatRooms,
  groupChatMembers,
  groupChatMessages,
  userStatus,
  messageReactions,
  chatMentions,
  users,
} from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const groupChatRouter = router({
  // Create a new group chat room
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        icon: z.string().optional(),
        isPublic: z.boolean().default(true),
        maxMembers: z.number().default(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .insert(groupChatRooms)
        .values({
          name: input.name,
          description: input.description,
          icon: input.icon,
          createdBy: ctx.user.id,
          isPublic: input.isPublic,
          maxMembers: input.maxMembers,
        });

      return { success: true };
    }),

  // Get all public rooms
  getRooms: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    return await db
      .select()
      .from(groupChatRooms)
      .where(and(eq(groupChatRooms.isPublic, true), eq(groupChatRooms.isActive, true)))
      .orderBy(desc(groupChatRooms.createdAt));
  }),

  // Get room details with members
  getRoomDetails: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const room = await db
        .select()
        .from(groupChatRooms)
        .where(eq(groupChatRooms.id, input.roomId));

      const members = await db
        .select({
          id: groupChatMembers.id,
          userId: groupChatMembers.userId,
          userName: users.name,
          userEmail: users.email,
          role: groupChatMembers.role,
          joinedAt: groupChatMembers.joinedAt,
          status: userStatus.status,
        })
        .from(groupChatMembers)
        .leftJoin(users, eq(groupChatMembers.userId, users.id))
        .leftJoin(userStatus, eq(groupChatMembers.userId, userStatus.userId))
        .where(eq(groupChatMembers.roomId, input.roomId));

      return { room: room[0], members };
    }),

  // Join a room
  joinRoom: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if already a member
      const existing = await db
        .select()
        .from(groupChatMembers)
        .where(
          and(
            eq(groupChatMembers.roomId, input.roomId),
            eq(groupChatMembers.userId, ctx.user.id)
          )
        );

      if (existing.length > 0) {
        return existing[0];
      }

      await db
        .insert(groupChatMembers)
        .values({
          roomId: input.roomId,
          userId: ctx.user.id,
          role: "member",
        });

      return { success: true };
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        content: z.string().min(1),
        messageType: z.enum(["text", "image", "file", "emoji", "link", "system"]).default("text"),
        imageUrl: z.string().optional(),
        fileUrl: z.string().optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
        emoji: z.string().optional(),
        linkUrl: z.string().optional(),
        linkTitle: z.string().optional(),
        replyToId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .insert(groupChatMessages)
        .values({
          roomId: input.roomId,
          senderId: ctx.user.id,
          messageType: input.messageType,
          content: input.content,
          imageUrl: input.imageUrl,
          fileUrl: input.fileUrl,
          fileName: input.fileName,
          fileSize: input.fileSize,
          emoji: input.emoji,
          linkUrl: input.linkUrl,
          linkTitle: input.linkTitle,
          replyToId: input.replyToId,
        });

      return { success: true };
    }),

  // Get messages for a room
  getMessages: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const messages = await db
        .select({
          id: groupChatMessages.id,
          content: groupChatMessages.content,
          messageType: groupChatMessages.messageType,
          imageUrl: groupChatMessages.imageUrl,
          fileUrl: groupChatMessages.fileUrl,
          fileName: groupChatMessages.fileName,
          emoji: groupChatMessages.emoji,
          linkUrl: groupChatMessages.linkUrl,
          linkTitle: groupChatMessages.linkTitle,
          replyToId: groupChatMessages.replyToId,
          isEdited: groupChatMessages.isEdited,
          isDeleted: groupChatMessages.isDeleted,
          createdAt: groupChatMessages.createdAt,
          sender: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(groupChatMessages)
        .leftJoin(users, eq(groupChatMessages.senderId, users.id))
        .where(eq(groupChatMessages.roomId, input.roomId))
        .orderBy(desc(groupChatMessages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return messages;
    }),

  // Update user status
  updateStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(["online", "away", "busy", "offline"]),
        statusMessage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const existing = await db
        .select()
        .from(userStatus)
        .where(eq(userStatus.userId, ctx.user.id));

      if (existing.length > 0) {
        await db
          .update(userStatus)
          .set({
            status: input.status,
            statusMessage: input.statusMessage,
            lastSeenAt: new Date(),
          })
          .where(eq(userStatus.userId, ctx.user.id));

        return { success: true };
      } else {
        await db
          .insert(userStatus)
          .values({
            userId: ctx.user.id,
            status: input.status,
            statusMessage: input.statusMessage,
          });

        return { success: true };
      }
    }),

  // Get online users
  getOnlineUsers: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: userStatus.status,
        statusMessage: userStatus.statusMessage,
        lastSeenAt: userStatus.lastSeenAt,
      })
      .from(userStatus)
      .leftJoin(users, eq(userStatus.userId, users.id))
      .where(eq(userStatus.status, "online"));
  }),

  // Add emoji reaction to message
  addReaction: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
        emoji: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .insert(messageReactions)
        .values({
          messageId: input.messageId,
          userId: ctx.user.id,
          emoji: input.emoji,
        });

      return { success: true };
    }),

  // Get reactions for a message
  getReactions: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      return await db
        .select()
        .from(messageReactions)
        .where(eq(messageReactions.messageId, input.messageId));
    }),

  // Set typing status
  setTyping: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        isTyping: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const existing = await db
        .select()
        .from(userStatus)
        .where(eq(userStatus.userId, ctx.user.id));

      if (existing.length > 0) {
        await db
          .update(userStatus)
          .set({
            isTyping: input.isTyping,
            typingRoomId: input.isTyping ? input.roomId : null,
          })
          .where(eq(userStatus.userId, ctx.user.id));
      }

      return { success: true };
    }),

  // Get AI response (waed)
  getAIResponse: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        userMessage: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Generate AI response as waed
      const aiResponse = {
        id: Math.floor(Math.random() * 1000000),
        roomId: input.roomId,
        content: 'شكراً على رسالتك! أنا وعد، وأنا هنا لمساعدتك في أي استفسار.',
        messageType: 'ai' as const,
        sender: {
          id: 0,
          name: 'waed',
          email: 'waed@rose-online.com',
          role: 'ai',
        },
        createdAt: new Date().toISOString(),
        isEdited: false,
        isAI: true,
      };

      // Save AI message to database
      try {
        await db.insert(groupChatMessages).values({
          roomId: input.roomId,
          senderId: 0,
          messageType: 'system',
          content: aiResponse.content,
        });
      } catch (error) {
        console.error('Error saving AI message:', error);
      }

      return aiResponse;
    }),
});
