import { describe, it, expect } from "vitest";
import { referralRouter } from "./routers-referral";
import { router } from "./_core/trpc";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// Wrap the referral router in a top-level router for createCaller
const testRouter = router({ referral: referralRouter });

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
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
    name: "Regular User",
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

describe("Referral Router", () => {
  describe("getMyReferralStats", () => {
    it("should return referral stats for authenticated user", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      const stats = await caller.referral.getMyReferralStats();

      expect(stats).toBeDefined();
      expect(stats.referralLink).toContain("ref=");
      expect(stats.totalReferrals).toBe(0);
      expect(stats.totalEarnings).toBe("0");
      expect(stats.pendingEarnings).toBe("0");
    });

    it("should reject unauthenticated users", async () => {
      const ctx = createUnauthContext();
      const caller = testRouter.createCaller(ctx);

      await expect(caller.referral.getMyReferralStats()).rejects.toThrow();
    });
  });

  describe("getMyReferrals", () => {
    it("should return empty referrals list", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.getMyReferrals({
        limit: 10,
        offset: 0,
      });

      expect(result.referrals).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getMyCommissions", () => {
    it("should return empty commissions list", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.getMyCommissions({
        limit: 10,
        offset: 0,
      });

      expect(result.commissions).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("should accept optional status filter", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.getMyCommissions({
        status: "pending",
        limit: 10,
        offset: 0,
      });

      expect(result.commissions).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getAllReferrals (admin)", () => {
    it("should return empty referrals for admin", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.getAllReferrals({
        limit: 10,
        offset: 0,
      });

      expect(result.referrals).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.referral.getAllReferrals({ limit: 10, offset: 0 })
      ).rejects.toThrow();
    });

    it("should reject unauthenticated users", async () => {
      const ctx = createUnauthContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.referral.getAllReferrals({ limit: 10, offset: 0 })
      ).rejects.toThrow();
    });
  });

  describe("getAllCommissions (admin)", () => {
    it("should return empty commissions for admin", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.getAllCommissions({
        limit: 10,
        offset: 0,
      });

      expect(result.commissions).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.referral.getAllCommissions({ limit: 10, offset: 0 })
      ).rejects.toThrow();
    });
  });

  describe("approveCommission (admin)", () => {
    it("should approve commission successfully", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.approveCommission({
        commissionId: 1,
      });

      expect(result.success).toBe(true);
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.referral.approveCommission({ commissionId: 1 })
      ).rejects.toThrow();
    });
  });

  describe("rejectCommission (admin)", () => {
    it("should reject commission successfully", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.rejectCommission({
        commissionId: 1,
        reason: "Invalid referral",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("createReferral (admin)", () => {
    it("should create referral successfully", async () => {
      const ctx = createAdminContext();
      const caller = testRouter.createCaller(ctx);

      const result = await caller.referral.createReferral({
        referrerId: 1,
        referredUserId: 2,
        earnings: "50",
      });

      expect(result.success).toBe(true);
      expect(result.referralId).toBe(0);
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      await expect(
        caller.referral.createReferral({
          referrerId: 1,
          referredUserId: 2,
          earnings: "50",
        })
      ).rejects.toThrow();
    });
  });

  describe("getReferralProgramInfo", () => {
    it("should return program information", async () => {
      const ctx = createUserContext();
      const caller = testRouter.createCaller(ctx);

      const info = await caller.referral.getReferralProgramInfo();

      expect(info.commissionPercentage).toBe(5);
      expect(info.minimumWithdrawal).toBe("100");
      expect(info.description).toContain("5%");
    });
  });
});
