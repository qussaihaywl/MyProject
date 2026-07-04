import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { couponsRouter } from "./routers-coupons";
import { router } from "./_core/trpc";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnValue([
      {
        id: 1,
        code: "SAVE10",
        discountType: "percentage",
        discountValue: "10",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        createdAt: new Date(),
      },
    ]),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  }),
}));

const testRouter = router({ coupons: couponsRouter });

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("Coupons Router", () => {
  describe("Input Validation", () => {
    const createCouponSchema = z.object({
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
    });

    it("should validate valid coupon input", () => {
      const validInput = {
        code: "SAVE10",
        discountType: "percentage" as const,
        discountValue: "10",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      };

      const result = createCouponSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid discount type", () => {
      const invalidInput = {
        code: "SAVE10",
        discountType: "invalid",
        discountValue: "10",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      };

      const result = createCouponSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const input = {
        code: "FREESHIP",
        discountType: "fixed" as const,
        discountValue: "5",
        description: "Free shipping coupon",
        minOrderAmount: "50",
        maxDiscount: "5",
        usageLimit: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      };

      const result = createCouponSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.usagePerUser).toBe(1); // default value
        expect(result.data.isActive).toBe(true); // default value
      }
    });

    it("should validate getAllCoupons pagination input", () => {
      const paginationSchema = z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      });

      expect(paginationSchema.safeParse({ limit: 10, offset: 0 }).success).toBe(
        true
      );
      expect(paginationSchema.safeParse({ limit: 0, offset: 0 }).success).toBe(
        false
      );
      expect(paginationSchema.safeParse({ limit: 51, offset: 0 }).success).toBe(
        false
      );
      expect(
        paginationSchema.safeParse({ limit: 20, offset: -1 }).success
      ).toBe(false);
      expect(paginationSchema.safeParse({}).success).toBe(true); // defaults
    });

    it("should validate updateCoupon input", () => {
      const updateSchema = z.object({
        code: z.string(),
        description: z.string().optional(),
        discountValue: z.string().optional(),
        discountType: z.enum(["percentage", "fixed"]).optional(),
        usageLimit: z.number().min(1).optional(),
        endDate: z.date().optional(),
        isActive: z.boolean().optional(),
      });

      expect(updateSchema.safeParse({ code: "SAVE10" }).success).toBe(true);
      expect(
        updateSchema.safeParse({ code: "SAVE10", isActive: false }).success
      ).toBe(true);
      expect(
        updateSchema.safeParse({ code: "SAVE10", usageLimit: 0 }).success
      ).toBe(false);
    });
  });

  describe("Authorization", () => {
    it("should allow admin to get all coupons", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.coupons.getAllCoupons({
        limit: 20,
        offset: 0,
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject non-admin users from getAllCoupons", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.coupons.getAllCoupons({ limit: 20, offset: 0 })
      ).rejects.toThrow();
    });

    it("should reject unauthenticated users from getAllCoupons", async () => {
      const ctx = createUnauthContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.coupons.getAllCoupons({ limit: 20, offset: 0 })
      ).rejects.toThrow();
    });

    it("should allow public access to getCouponByCode", async () => {
      const ctx = createUnauthContext();
      const caller = testRouter.createCaller(ctx);

      // This is a public procedure - it will throw NOT_FOUND because
      // our mock returns an empty result for the where() chain,
      // but it should NOT throw an auth error
      try {
        await caller.coupons.getCouponByCode({ code: "SAVE10" });
      } catch (error: any) {
        // Should get NOT_FOUND, not UNAUTHORIZED
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should reject non-admin from createCoupon", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.coupons.createCoupon({
          code: "NEW10",
          discountType: "percentage",
          discountValue: "10",
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000),
        })
      ).rejects.toThrow();
    });

    it("should reject non-admin from updateCoupon", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.coupons.updateCoupon({ code: "SAVE10", isActive: false })
      ).rejects.toThrow();
    });

    it("should reject non-admin from deleteCoupon", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.coupons.deleteCoupon({ code: "SAVE10" })
      ).rejects.toThrow();
    });
  });

  describe("Admin Operations", () => {
    it("should create coupon as admin", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.coupons.createCoupon({
        code: "SUMMER25",
        discountType: "percentage",
        discountValue: "25",
        description: "Summer sale discount",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 86400000),
      });

      expect(result.success).toBe(true);
    });

    it("should update coupon as admin", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.coupons.updateCoupon({
        code: "SAVE10",
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it("should delete coupon as admin", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.coupons.deleteCoupon({ code: "SAVE10" });

      expect(result.success).toBe(true);
    });
  });
});
