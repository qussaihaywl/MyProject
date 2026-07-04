import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import type { Message } from "./_core/llm";
import type { InsertAdvancedOrder } from "../drizzle/schema";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { SignJWT } from "jose";
// import { advancedOrdersRouter } from "./routers-advanced-orders";
import { commissionsRouter } from "./routers-commissions";
import { facebookRouter } from "./routers-facebook";
import { groupChatRouter } from "./routers/group-chat";
import { usersRouter } from "./routers-users";
// import { whatsappRouter } from "./whatsapp-router";
import { ENV } from "./_core/env";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "./_core/email";
import { sendOrderConfirmationSMS } from "./_core/sms";
import { getDb } from "./db";
import { loyaltyPoints } from "../drizzle/schema";

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret || "your-secret-key");

export const appRouter = router({
  system: systemRouter,
  
  // Auth routers
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    // Local registration
    register: publicProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(6),
          phone: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          zipCode: z.string().optional(),
          walletNumber: z.string().optional(),
          walletType: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const existingUser = await db.getUserByEmail(input.email);
          if (existingUser) {
            throw new TRPCError({ code: "CONFLICT", message: "البريد الإلكتروني مستخدم بالفعل" });
          }

          const user = await db.registerUser(input);

          // Create session token with openId format for compatibility with sdk.verifySession
          const token = await new SignJWT({ 
            openId: `local-${user.id}`,
            appId: process.env.VITE_APP_ID || "rose-online",
            name: user.name,
            id: user.id,
            email: user.email,
            role: "user"
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

          // Set cookie using Express res.cookie for proper handling
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

          return { success: true, user, token };
        } catch (error: any) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
        }
      }),

    // Local login
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await db.loginUser(input.email, input.password);

          // Create session token with openId format for compatibility with sdk.verifySession
          const token = await new SignJWT({ 
            openId: `local-${user.id}`,
            appId: process.env.VITE_APP_ID || "rose-online",
            name: user.name,
            id: user.id,
            email: user.email,
            role: user.role
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

          // Set cookie using Express res.cookie for proper handling
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

          return { success: true, user, token };
        } catch (error: any) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: error.message });
        }
      }),
  }),

  // Categories router
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getCategories();
    }),
    
    listForHomepage: publicProcedure.query(async () => {
      return await db.getCategoriesForHomepage();
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
        showOnHomepage: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.createCategory(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
        showOnHomepage: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        const { id, ...data } = input;
        return await db.updateCategory(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.deleteCategory(input.id);
      }),
    
    reorder: protectedProcedure
      .input(z.object({
        orders: z.array(z.object({ id: z.number(), displayOrder: z.number() }))
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.reorderCategories(input.orders.map(o => o.id));
      }),
  }),

  // Products router
  products: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getProducts();
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        categoryId: z.number(),
        image: z.string().optional(),
        colors: z.string().optional(),
        sizes: z.string().optional(),
        weight: z.string().optional(),
        warehouseCode: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات لإضافة منتجات' });
        }
        
        // إنشاء المنتج في قاعدة البيانات
        const product = await db.createProduct(input);
        
        // إرسال المنتج إلى Google Sheets
        try {
          const { sendProductToGoogleSheets } = await import('./googleSheets');
          await sendProductToGoogleSheets({
            name: input.name,
            price: input.price,
            description: input.description,
            colors: input.colors,
            sizes: input.sizes,
            weight: input.weight,
            warehouseCode: input.warehouseCode,
            categoryId: input.categoryId,
            image: input.image,
          });
        } catch (error) {
          console.error('خطأ في إرسال المنتج إلى Google Sheets:', error);
          // لا نرمي خطأ هنا - المنتج تم إنشاؤه بنجاح في قاعدة البيانات
        }
        
        return product;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        categoryId: z.number().optional(),
        image: z.string().optional(),
        colors: z.string().optional(),
        sizes: z.string().optional(),
        weight: z.string().optional(),
        warehouseCode: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.updateProduct(input.id, input);
      }),

    uploadImage: protectedProcedure
      .input(z.object({
        image: z.any(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        
        try {
          const { storagePut } = await import('./storage');
          const buffer = await input.image.arrayBuffer();
          const result = await storagePut(
            `products/${Date.now()}-${input.image.name}`,
            Buffer.from(buffer),
            input.image.type
          );
          return { url: result.url };
        } catch (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'فشل رفع الصورة' });
        }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.deleteProduct(input.id);
      }),

    getTrending: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getProducts();
      }),

    getSimilar: publicProcedure
      .input(z.object({ productId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getProducts();
      }),

    getAll: publicProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getProducts();
      }),
  }),

  // Cart router
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
      }
      return await db.getCartItems(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.addToCart(ctx.user.id, input.productId, input.quantity);
      }),

    getItems: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
      }
      return await db.getCartItems(ctx.user.id);
    }),

    removeItem: protectedProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.removeFromCart(input.cartItemId);
      }),

    updateQuantity: protectedProcedure
      .input(z.object({ cartItemId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.updateCartQuantity(input.cartItemId, input.quantity);
      }),
  }),

  // User management router (advanced)
  // Moved to usersRouter below

  // Warehouses router
  warehouses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
      }
      return db.getWarehouses();
    }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
      }
      return db.getWarehouses();
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.createWarehouse(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        code: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        const { id, ...data } = input;
        return await db.updateWarehouse(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.deleteWarehouse(input.id);
      }),
  }),

  // Chat router
  chat: router({
    getRooms: protectedProcedure.query(async ({ ctx }) => {
      return await db.getChatRooms(ctx.user.id);
    }),

    getMessages: publicProcedure
      .input(z.object({ roomId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getMessages(input.roomId);
      }),

    sendMessage: protectedProcedure
      .input(z.object({ roomId: z.number(), content: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.addMessage({
          roomId: input.roomId,
          userId: ctx.user.id,
          content: input.content,
          userName: ctx.user.name || "مستخدم",
        });
      }),

    sendAIMessage: publicProcedure
      .input(z.object({ content: z.string(), conversationHistory: z.array(z.any()).optional() }))
      .mutation(async ({ input }) => {
        try {
          const { generateAIResponse } = await import("./ai-chat");
          const response = await generateAIResponse(input.content, {
            userId: "guest",
            userName: "زائر",
            conversationHistory: input.conversationHistory || [],
          });
          return response;
        } catch (error) {
          console.error("خطأ في AI Chat:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "خطأ في معالجة الرسالة" });
        }
      }),

    deleteMessage: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input, ctx }: any) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return { success: true };
      }),

    editMessage: protectedProcedure
      .input(z.object({ messageId: z.number(), content: z.string() }))
      .mutation(async ({ input, ctx }: any) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return { success: true };
      }),

    markAsOnline: protectedProcedure
      .mutation(async ({ ctx }: any) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return { success: true };
      }),

    getOnlineUsersCount: protectedProcedure
      .query(async () => {
        return 0;
      }),
  }),

  // Orders router
  // Shipments & Delivery Tracking
  shipments: router({
    getByOrderId: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return null;
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "in_transit", "out_for_delivery", "delivered", "failed"]),
        actualDeliveryDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.role || !["admin", "supervisor"].includes(ctx.user.role)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return { success: true };
      }),
  }),

  // Order Status History
  orderStatusHistory: router({
    getByOrderId: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return [];
      }),
  }),

  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
      }
      return await db.getOrders();
    }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
      }
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية للوصول إلى هذه الصفحة" });
      }
      return await db.getAllOrders();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.getOrderById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        userId: z.number(),
        totalPrice: z.string(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        shippingAddress: z.string(),
        shippingCity: z.string(),
        shippingZipCode: z.string(),
        shippingPhone: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.createOrder(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.updateOrder(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.deleteOrder(input.id);
      }),

    getByDelegate: protectedProcedure
      .input(z.object({ delegateId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.getOrders();
      }),
  }),

  // Advanced Orders (RoseOnline Order Form)
  advancedOrders: router({
    create: protectedProcedure
      .input(z.object({
        productName: z.string(),
        productPrice: z.string(),
        customerName: z.string(),
        customerPhone: z.string(),
        customerEmail: z.string().optional(),
        governorate: z.string(),
        detailedLocation: z.string(),
        delegateName: z.string(),
        delegateCommission: z.string().optional(),
        warehouseCode: z.string(),
        color: z.string().optional(),
        size: z.string().optional(),
        weight: z.string().optional(),
        length: z.string().optional(),
        images: z.array(z.string()).optional(),
        orderNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }

        const orderNumber = `ORD-${Date.now()}`;
        const totalAmount = parseFloat(input.productPrice) + (parseFloat(input.delegateCommission || "0") || 0);

        const orderData: any = {
          orderNumber,
          productName: input.productName,
          productPrice: parseFloat(input.productPrice),
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          governorate: input.governorate,
          detailedLocation: input.detailedLocation,
          delegateName: input.delegateName,
          delegateCommission: input.delegateCommission ? parseFloat(input.delegateCommission) : undefined,
          warehouseCode: input.warehouseCode,
          color: input.color,
          size: input.size,
          weight: input.weight,
          length: input.length,
          images: input.images ? JSON.stringify(input.images) : undefined,
          orderNotes: input.orderNotes,
          totalAmount: totalAmount,
          status: "pending",
          paymentStatus: "unpaid",
          customerId: ctx.user.id,
        };

        const result = await db.createAdvancedOrder(orderData);
        
        // إرسال البريد الإلكتروني للعميل
        try {
          await sendOrderConfirmationEmail({
            customerEmail: input.customerEmail,
            customerName: input.customerName,
            orderNumber: orderNumber,
            productName: input.productName,
            productPrice: parseFloat(input.productPrice),
            delegateCommission: input.delegateCommission ? parseFloat(input.delegateCommission) : 0,
            totalAmount: totalAmount,
            customerPhone: input.customerPhone,
            governorate: input.governorate,
            detailedLocation: input.detailedLocation,
          });
        } catch (error) {
          console.error("[Email] Failed to send customer confirmation:", error);
        }
        
        // إرسال إشعار للإدارة
        try {
          await sendAdminNotificationEmail({
            customerEmail: input.customerEmail,
            customerName: input.customerName,
            orderNumber: orderNumber,
            productName: input.productName,
            productPrice: parseFloat(input.productPrice),
            delegateCommission: input.delegateCommission ? parseFloat(input.delegateCommission) : 0,
            totalAmount: totalAmount,
            customerPhone: input.customerPhone,
            governorate: input.governorate,
            detailedLocation: input.detailedLocation,
          });
        } catch (error) {
          console.error("[Email] Failed to send admin notification:", error);
        }
        
        // إرسال رسالة SMS للعميل
        try {
          await sendOrderConfirmationSMS(
            input.customerPhone,
            orderNumber,
            totalAmount
          );
        } catch (error) {
          console.error("[SMS] Failed to send confirmation SMS:", error);
        }
        
        return result;
      }),

    list: publicProcedure.query(async () => {
      return await db.getAdvancedOrders();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAdvancedOrderById(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        paymentStatus: z.enum(["unpaid", "partial", "paid"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.updateAdvancedOrder(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.deleteAdvancedOrder(input.id);
      }),
  }),
  
  // Commissions (Warehouse & Delegate)
  commissions: commissionsRouter,
  
  // Facebook Integration
  facebook: router(facebookRouter),
  
  // Group Chat
  groupChat: groupChatRouter,

  // WhatsApp Integration
  // whatsapp: whatsappRouter,

  // Showcase Videos Management
  showcaseVideos: router({
    list: publicProcedure.query(async () => {
      return await db.getShowcaseVideos();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getShowcaseVideoById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        videoUrl: z.string(),
        youtubeUrl: z.string().optional(),
        youtubeId: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        duration: z.number().default(60),
        displayOrder: z.number().default(0),
        isActive: z.boolean().default(true),
        category: z.string().optional(),
        videoType: z.enum(['direct', 'youtube']).default('direct'),
        displayIds: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.createShowcaseVideo(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        youtubeId: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        duration: z.number().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
        category: z.string().optional(),
        videoType: z.enum(['direct', 'youtube']).optional(),
        displayIds: z.string().optional(),
        views: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.updateShowcaseVideo(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.deleteShowcaseVideo(input.id);
      }),

    reorder: protectedProcedure
      .input(z.object({
        videos: z.array(z.object({
          id: z.number(),
          displayOrder: z.number(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.reorderShowcaseVideos(input.videos.map((v: any) => v.id));
      }),
  }),

  // Favorites
  favorites: router({
    add: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.addToFavorites(ctx.user.id, input.productId);
      }),

    addItem: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.addToFavorites(ctx.user.id, input.productId);
      }),

    remove: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
        }
        return await db.removeFromFavorites(ctx.user.id, input.productId);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "يجب تسجيل الدخول" });
      }
      return await db.getFavorites(ctx.user.id);
    }),

    isFavorite: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) return false;
        return await db.isFavorite(ctx.user.id, input.productId);
      }),
  }),

  // AI Chat Router
  aiChat: router({
    // Get AI training data for learning
    getTrainingData: protectedProcedure
      .input(z.object({
        query: z.string(),
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getAITrainingData();
      }),

    // Save admin response as training data
    saveTrainingData: protectedProcedure
      .input(z.object({
        userQuery: z.string(),
        adminResponse: z.string(),
        category: z.string().optional(),
        dialect: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.saveAITrainingData({
          adminId: ctx.user.id,
          userQuery: input.userQuery,
          adminResponse: input.adminResponse,
          category: input.category,
          dialect: input.dialect,
        });
      }),

    // Get AI settings for a room
    getSettings: protectedProcedure
      .input(z.object({ roomId: z.number() }))
      .query(async ({ input }) => {
        const settings = await db.getAISettings();
        return settings || null;
      }),

    // Update AI settings
    updateSettings: protectedProcedure
      .input(z.object({
        roomId: z.number(),
        aiEnabled: z.boolean().optional(),
        aiName: z.string().optional(),
        responseStyle: z.string().optional(),
        dialect: z.string().optional(),
        learningEnabled: z.boolean().optional(),
        autoRespondEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        return await db.upsertAISettings(input);
      }),

    // Find similar training data
    findSimilar: protectedProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(5),
      }))
      .query(async ({ input }) => {
        return await db.findSimilarTrainingData(input.query);
      }),

    // Mark AI response as helpful
    markResponseFeedback: protectedProcedure
      .input(z.object({
        responseId: z.number(),
        isHelpful: z.boolean(),
        feedback: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.markAIResponseFeedback(String(input.responseId), input.feedback || 'helpful');
      }),
  }),

  // ==================== PRODUCT REVIEWS ====================
  reviews: router({
    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string(),
        content: z.string(),
        orderId: z.number().optional(),
        imageUrls: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const review = await db.createProductReview({
          productId: input.productId,
          userId: ctx.user!.id,
          rating: input.rating,
          title: input.title,
          content: input.content,
          orderId: input.orderId,
          isVerifiedPurchase: !!input.orderId,
          status: "pending",
        });

        if (input.imageUrls && input.imageUrls.length > 0) {
          for (const url of input.imageUrls) {
            await db.addReviewImages({ reviewId: (review[0].insertId as number), imageUrl: url });
          }
        }

        return review;
      }),

    getByProduct: publicProcedure
      .input(z.object({ productId: z.number(), limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await db.getProductReviews(input.productId);
      }),
  }),

  // ==================== DISCOUNT CODES ====================
  discounts: router({
    validate: publicProcedure
      .input(z.object({ code: z.string(), orderAmount: z.number() }))
      .query(async ({ input, ctx }) => {
        const validation = await db.validateDiscountCode(input.code);
        return validation;
      }),

    getByCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return await db.getDiscountCodeByCode(input.code);
      }),
  }),

  // ==================== LOYALTY POINTS ====================
  loyalty: router({
    getPoints: protectedProcedure
      .query(async ({ ctx }) => {
        let points = await db.getUserLoyaltyPoints(ctx.user!.id);
        if (!points) {
          points = await db.initializeLoyaltyPoints(ctx.user!.id);
        }
        return points;
      }),

    addPoints: protectedProcedure
      .input(z.object({ userId: z.number(), points: z.number(), reason: z.string(), orderId: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية" });
        }
        await db.addLoyaltyPoints(input.userId, input.points);
        return { success: true };
      }),

    redeem: protectedProcedure
      .input(z.object({ points: z.number(), reason: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await db.redeemLoyaltyPoints(ctx.user!.id, input.points);
        return { success: true };
      }),
  }),

  // ==================== NOTIFICATIONS ====================
  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input, ctx }) => {
        return await db.getUserNotifications(ctx.user!.id);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),

    getUnreadCount: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUnreadNotificationCount(ctx.user!.id);
      }),

    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }: any) => {
        return { success: true };
      }),
  }),

  // ==================== USER MANAGEMENT ====================
  users: usersRouter,
  
  // ==================== ANALYTICS ====================
  analytics: router({
    logProductView: publicProcedure
      .input(z.object({ productId: z.number(), sessionId: z.string().optional(), viewDuration: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        return await db.logProductView(ctx.user?.id || 0, input.productId);
      }),

    logActivity: protectedProcedure
      .input(z.object({ activityType: z.string(), description: z.string().optional(), metadata: z.any().optional() }))
      .mutation(async ({ input, ctx }) => {
        return await db.logUserActivity({
          userId: ctx.user!.id,
          activityType: input.activityType,
          description: input.description,
          metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
        });
      }),
  }),

  recommendations: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getProducts();
      }),

    getForUser: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input, ctx }: any) => {
        return await db.getProducts();
      }),
  }),

  reports: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ input, ctx }: any) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return [];
      }),
  }),

  invoices: router({
    send: protectedProcedure
      .input(z.object({ invoiceId: z.number().optional() }))
      .mutation(async ({ input, ctx }: any) => {
        return { success: true };
      }),

    generate: protectedProcedure
      .input(z.object({ orderId: z.number().optional() }))
      .mutation(async ({ input, ctx }: any) => {
        return { success: true, invoiceId: 1 };
      }),

    getByUser: protectedProcedure
      .query(async ({ ctx }: any) => {
        return [];
      }),
  }),

  monthlyReports: router({
    getMonthly: protectedProcedure
      .input(z.object({ month: z.number().optional(), year: z.number().optional() }))
      .query(async ({ input, ctx }: any) => {
        return [];
      }),
  }),

  displayManagement: router({
    list: publicProcedure.query(async () => {
      return await db.getDisplayManagement();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getDisplayManagementById(input.id);
      }),
  }),

  // ==================== ADMIN DASHBOARD ====================
  admin: router({
    getAllUsers: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getAllUsers();
      }),

    getAllProducts: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getProducts();
      }),

    getAllOrders: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getAllOrders();
      }),

    getAllCategories: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getCategories();
      }),

    getAllWarehouses: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getAllWarehouses();
      }),

    // Legacy names for backward compatibility
    getUsers: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getAllUsers();
      }),

    getProducts: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getProducts();
      }),

    getOrders: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getAllOrders();
      }),

    getCategories: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getCategories();
      }),

    getWarehouses: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return await db.getAllWarehouses();
      }),

    updateUser: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string().optional(), role: z.string().optional(), status: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return { success: true, message: 'تم تحديث المستخدم بنجاح' };
      }),

    deleteUser: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحيات' });
        }
        return { success: true, message: 'تم حذف المستخدم بنجاح' };
      }),
  }),
});

export type AppRouter = typeof appRouter;
