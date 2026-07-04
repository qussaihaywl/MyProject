/**
 * Role Hierarchy and Permissions
 * ترتيب الأدوار من الأعلى إلى الأقل صلاحية
 */

export type UserRole = "admin" | "supervisor" | "delegate" | "user";

// ترتيب الأدوار حسب الصلاحيات (من الأعلى إلى الأقل)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  supervisor: 3,
  delegate: 2,
  user: 1,
};

// أسماء الأدوار بالعربية
export const ROLE_NAMES: Record<UserRole, string> = {
  admin: "مسؤول",
  supervisor: "مشرف",
  delegate: "مندوب",
  user: "مستخدم",
};

// الألوان المخصصة لكل دور
export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; badge: string }> = {
  admin: {
    bg: "bg-red-500/20",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
  },
  supervisor: {
    bg: "bg-orange-500/20",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700",
  },
  delegate: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
  },
  user: {
    bg: "bg-blue-500/20",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
};

// الأيقونات المخصصة لكل دور
export const ROLE_ICONS: Record<UserRole, string> = {
  admin: "👑",
  supervisor: "🎖️",
  delegate: "💼",
  user: "👤",
};

// الصلاحيات المخصصة لكل دور
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: [
    "view_profile",
    "edit_profile",
    "view_orders",
    "view_products",
    "create_review",
  ],
  delegate: [
    "view_profile",
    "edit_profile",
    "view_orders",
    "view_products",
    "create_review",
    "manage_own_sales",
    "view_sales_reports",
  ],
  supervisor: [
    "view_profile",
    "edit_profile",
    "view_orders",
    "view_products",
    "create_review",
    "manage_agents",
    "view_sales_reports",
    "manage_inventory",
    "view_analytics",
  ],
  admin: [
    "manage_all_users",
    "manage_roles",
    "manage_permissions",
    "view_all_data",
    "manage_system",
    "manage_products",
    "manage_orders",
    "manage_reports",
    "manage_settings",
    "manage_admins",
  ],
};

// دالة للتحقق من صلاحية المستخدم
export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

// دالة للتحقق من أن دور واحد أعلى من آخر
export function isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

// دالة للتحقق من أن دور واحد أقل من أو يساوي آخر
export function isRoleLowerOrEqual(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] <= ROLE_HIERARCHY[role2];
}

// دالة للحصول على اسم الدور بالعربية
export function getRoleName(role: UserRole): string {
  return ROLE_NAMES[role] || role;
}

// دالة للحصول على ألوان الدور
export function getRoleColors(role: UserRole) {
  return ROLE_COLORS[role] || ROLE_COLORS.user;
}

// دالة للحصول على أيقونة الدور
export function getRoleIcon(role: UserRole): string {
  return ROLE_ICONS[role] || "👤";
}

// ترتيب الأدوار للعرض
export const SORTED_ROLES: UserRole[] = ["admin", "supervisor", "delegate", "user"];
