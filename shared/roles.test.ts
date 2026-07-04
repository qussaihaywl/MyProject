import { describe, it, expect } from "vitest";
import {
  ROLE_HIERARCHY,
  ROLE_NAMES,
  ROLE_COLORS,
  ROLE_ICONS,
  ROLE_PERMISSIONS,
  SORTED_ROLES,
  hasPermission,
  isRoleHigherThan,
  isRoleLowerOrEqual,
  getRoleName,
  getRoleColors,
  getRoleIcon,
  type UserRole,
} from "./roles";

describe("Role System", () => {
  describe("ROLE_HIERARCHY", () => {
    it("should rank admin highest", () => {
      expect(ROLE_HIERARCHY.admin).toBe(4);
    });

    it("should rank user lowest", () => {
      expect(ROLE_HIERARCHY.user).toBe(1);
    });

    it("should have correct ordering: admin > supervisor > delegate > user", () => {
      expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.supervisor);
      expect(ROLE_HIERARCHY.supervisor).toBeGreaterThan(
        ROLE_HIERARCHY.delegate
      );
      expect(ROLE_HIERARCHY.delegate).toBeGreaterThan(ROLE_HIERARCHY.user);
    });
  });

  describe("ROLE_NAMES", () => {
    it("should have Arabic names for all roles", () => {
      const roles: UserRole[] = ["admin", "supervisor", "delegate", "user"];
      for (const role of roles) {
        expect(ROLE_NAMES[role]).toBeTruthy();
        expect(typeof ROLE_NAMES[role]).toBe("string");
      }
    });
  });

  describe("ROLE_COLORS", () => {
    it("should have bg, text, and badge for each role", () => {
      const roles: UserRole[] = ["admin", "supervisor", "delegate", "user"];
      for (const role of roles) {
        expect(ROLE_COLORS[role]).toHaveProperty("bg");
        expect(ROLE_COLORS[role]).toHaveProperty("text");
        expect(ROLE_COLORS[role]).toHaveProperty("badge");
      }
    });
  });

  describe("ROLE_ICONS", () => {
    it("should have an icon for each role", () => {
      const roles: UserRole[] = ["admin", "supervisor", "delegate", "user"];
      for (const role of roles) {
        expect(ROLE_ICONS[role]).toBeTruthy();
      }
    });
  });

  describe("ROLE_PERMISSIONS", () => {
    it("should give admin manage_all_users permission", () => {
      expect(ROLE_PERMISSIONS.admin).toContain("manage_all_users");
    });

    it("should give user view_products permission", () => {
      expect(ROLE_PERMISSIONS.user).toContain("view_products");
    });

    it("should give delegate manage_own_sales permission", () => {
      expect(ROLE_PERMISSIONS.delegate).toContain("manage_own_sales");
    });

    it("should give supervisor manage_agents permission", () => {
      expect(ROLE_PERMISSIONS.supervisor).toContain("manage_agents");
    });

    it("should not give user manage_all_users permission", () => {
      expect(ROLE_PERMISSIONS.user).not.toContain("manage_all_users");
    });
  });

  describe("SORTED_ROLES", () => {
    it("should contain all four roles", () => {
      expect(SORTED_ROLES).toHaveLength(4);
    });

    it("should start with admin and end with user", () => {
      expect(SORTED_ROLES[0]).toBe("admin");
      expect(SORTED_ROLES[SORTED_ROLES.length - 1]).toBe("user");
    });
  });

  describe("hasPermission", () => {
    it("should return true for valid permission", () => {
      expect(hasPermission("admin", "manage_all_users")).toBe(true);
    });

    it("should return false for invalid permission", () => {
      expect(hasPermission("user", "manage_all_users")).toBe(false);
    });

    it("should return true for user viewing products", () => {
      expect(hasPermission("user", "view_products")).toBe(true);
    });

    it("should return false for non-existent permission", () => {
      expect(hasPermission("admin", "nonexistent_permission")).toBe(false);
    });
  });

  describe("isRoleHigherThan", () => {
    it("should return true when admin compared to user", () => {
      expect(isRoleHigherThan("admin", "user")).toBe(true);
    });

    it("should return false when user compared to admin", () => {
      expect(isRoleHigherThan("user", "admin")).toBe(false);
    });

    it("should return false for equal roles", () => {
      expect(isRoleHigherThan("admin", "admin")).toBe(false);
    });

    it("should return true when supervisor compared to delegate", () => {
      expect(isRoleHigherThan("supervisor", "delegate")).toBe(true);
    });
  });

  describe("isRoleLowerOrEqual", () => {
    it("should return true when user compared to admin", () => {
      expect(isRoleLowerOrEqual("user", "admin")).toBe(true);
    });

    it("should return true for equal roles", () => {
      expect(isRoleLowerOrEqual("admin", "admin")).toBe(true);
    });

    it("should return false when admin compared to user", () => {
      expect(isRoleLowerOrEqual("admin", "user")).toBe(false);
    });
  });

  describe("getRoleName", () => {
    it("should return Arabic name for admin", () => {
      expect(getRoleName("admin")).toBe("مسؤول");
    });

    it("should return Arabic name for user", () => {
      expect(getRoleName("user")).toBe("مستخدم");
    });

    it("should return Arabic name for supervisor", () => {
      expect(getRoleName("supervisor")).toBe("مشرف");
    });

    it("should return Arabic name for delegate", () => {
      expect(getRoleName("delegate")).toBe("مندوب");
    });
  });

  describe("getRoleColors", () => {
    it("should return colors for admin", () => {
      const colors = getRoleColors("admin");
      expect(colors.bg).toContain("red");
      expect(colors.text).toContain("red");
    });

    it("should return colors for user", () => {
      const colors = getRoleColors("user");
      expect(colors.bg).toContain("blue");
    });

    it("should default to user colors for unknown role", () => {
      const colors = getRoleColors("unknown" as UserRole);
      expect(colors).toEqual(ROLE_COLORS.user);
    });
  });

  describe("getRoleIcon", () => {
    it("should return crown for admin", () => {
      expect(getRoleIcon("admin")).toBe("👑");
    });

    it("should return person icon for user", () => {
      expect(getRoleIcon("user")).toBe("👤");
    });

    it("should default to person icon for unknown role", () => {
      expect(getRoleIcon("unknown" as UserRole)).toBe("👤");
    });
  });
});
