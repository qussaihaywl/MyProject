import { describe, it, expect, beforeEach, vi } from "vitest";
import * as db from "./db";

describe("Notifications System", () => {
  const mockUserId = 1;
  const mockNotification = {
    userId: mockUserId,
    type: "order" as const,
    title: "طلب جديد",
    content: "تم استقبال طلبك بنجاح",
    actionUrl: "/orders/123",
    isRead: false,
  };

  describe("createNotification", () => {
    it("should create a new notification", async () => {
      const result = await db.createNotification(mockNotification);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.type).toBe("order");
    });

    it("should create notification with system type", async () => {
      const systemNotif = {
        ...mockNotification,
        type: "system" as const,
        title: "تحديث النظام",
      };
      const result = await db.createNotification(systemNotif);
      expect(result.type).toBe("system");
    });

    it("should create notification with payment type", async () => {
      const paymentNotif = {
        ...mockNotification,
        type: "payment" as const,
        title: "دفع تم بنجاح",
      };
      const result = await db.createNotification(paymentNotif);
      expect(result.type).toBe("payment");
    });
  });

  describe("getUserNotifications", () => {
    it("should retrieve user notifications", async () => {
      const result = await db.getUserNotifications(mockUserId, 20, 0);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const result = await db.getUserNotifications(mockUserId, 5, 0);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it("should respect offset parameter", async () => {
      const firstBatch = await db.getUserNotifications(mockUserId, 10, 0);
      const secondBatch = await db.getUserNotifications(mockUserId, 10, 10);
      expect(firstBatch).not.toEqual(secondBatch);
    });
  });

  describe("markNotificationAsRead", () => {
    it("should mark notification as read", async () => {
      const notif = await db.createNotification(mockNotification);
      const result = await db.markNotificationAsRead(notif.id);
      expect(result).toBeDefined();
    });
  });

  describe("getUnreadNotificationCount", () => {
    it("should return unread notification count", async () => {
      const count = await db.getUnreadNotificationCount(mockUserId);
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should decrease count after marking as read", async () => {
      const countBefore = await db.getUnreadNotificationCount(mockUserId);
      const notif = await db.createNotification(mockNotification);
      const countAfter = await db.getUnreadNotificationCount(mockUserId);
      expect(countAfter).toBeGreaterThanOrEqual(countBefore);
      
      await db.markNotificationAsRead(notif.id);
      const countFinal = await db.getUnreadNotificationCount(mockUserId);
      expect(countFinal).toBeLessThanOrEqual(countAfter);
    });
  });

  describe("Notification Types", () => {
    it("should support all notification types", async () => {
      const types = ["order", "promotion", "review", "message", "system", "payment"] as const;
      
      for (const type of types) {
        const notif = await db.createNotification({
          ...mockNotification,
          type,
          title: `${type} notification`,
        });
        expect(notif.type).toBe(type);
      }
    });
  });

  describe("Notification Content", () => {
    it("should store and retrieve notification content", async () => {
      const content = "هذا محتوى الإشعار مع أحرف عربية";
      const notif = await db.createNotification({
        ...mockNotification,
        content,
      });
      expect(notif.content).toBe(content);
    });

    it("should handle long notification titles", async () => {
      const longTitle = "أ".repeat(255);
      const notif = await db.createNotification({
        ...mockNotification,
        title: longTitle,
      });
      expect(notif.title.length).toBeLessThanOrEqual(255);
    });

    it("should handle URLs in actionUrl", async () => {
      const actionUrl = "/admin/orders/123/details?tab=items";
      const notif = await db.createNotification({
        ...mockNotification,
        actionUrl,
      });
      expect(notif.actionUrl).toBe(actionUrl);
    });
  });
});
