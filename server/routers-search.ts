import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { products, categories } from "../drizzle/schema";
import { eq, like, and, or, desc, lte, gte } from "drizzle-orm";

export const searchRouter = router({
  // البحث المتقدم عن المنتجات
  searchProducts: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        categoryId: z.number().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        minRating: z.number().min(0).max(5).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // بناء شروط البحث
      const conditions: any[] = [
        or(
          like(products.name, `%${input.query}%`),
          like(products.description, `%${input.query}%`)
        ),
      ];

      if (input.categoryId) conditions.push(eq(products.categoryId, input.categoryId));
      // if (input.minPrice) conditions.push(gte(products.price, input.minPrice));
      // if (input.maxPrice) conditions.push(lte(products.price, input.maxPrice));
      // if (input.minRating) conditions.push(gte(products.averageRating, input.minRating));

      const results = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        results,
        total: results.length,
        query: input.query,
      };
    }),

  // الحصول على الاقتراحات (autocomplete)
  getSuggestions: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(50),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const suggestions = await db
        .select({ name: products.name })
        .from(products)
        .where(like(products.name, `%${input.query}%`))
        .limit(input.limit);

      return suggestions.map((s) => s.name);
    }),

  // البحث حسب الفئة
  getByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const results = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, input.categoryId))
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  // الحصول على أفضل المنتجات تقييماً
  getTopRatedProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const results = await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(input.limit);

      return results;
    }),

  // الحصول على أحدث المنتجات
  getNewestProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const results = await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(input.limit);

      return results;
    }),

  // البحث حسب السعر
  getByPriceRange: publicProcedure
    .input(
      z.object({
        minPrice: z.number().min(0),
        maxPrice: z.number().min(0),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const results = await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),
});
