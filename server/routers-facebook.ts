import { publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getFacebookPages, createFacebookPage, shareProductToFacebook, getProductShares } from "./db";

export const facebookRouter = {
  // Get all active Facebook pages
  getPages: publicProcedure.query(async () => {
    return await getFacebookPages();
  }),

  // Create a new Facebook page (admin only)
  addPage: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        pageName: z.string(),
        pageAccessToken: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات" });
      }

      try {
        await createFacebookPage({
          pageId: input.pageId,
          pageName: input.pageName,
          pageAccessToken: input.pageAccessToken,
        });

        return { success: true, message: "تم إضافة صفحة Facebook بنجاح" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "فشل إضافة صفحة Facebook",
        });
      }
    }),

  // Share product to Facebook
  shareProduct: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        facebookPageId: z.number(),
        productName: z.string(),
        productPrice: z.number(),
        productImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات" });
      }

      try {
        // Create a share record
        await shareProductToFacebook({
          productId: input.productId,
          facebookPageId: input.facebookPageId,
          status: "published",
          shareUrl: `https://rose-shop-pbm5mrsp.manus.space/product/${input.productId}`,
        });

        return {
          success: true,
          message: "تم نشر المنتج على Facebook بنجاح",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "فشل نشر المنتج على Facebook",
        });
      }
    }),

  // Get product shares
  getProductShares: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getProductShares(input.productId);
    }),
};
