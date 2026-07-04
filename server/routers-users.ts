import { router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { eq, and, like } from "drizzle-orm";
import { users } from "../drizzle/schema";

// Define role hierarchy and permissions
const ROLE_PERMISSIONS = {
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

export const usersRouter = router({
  // ==================== USER MANAGEMENT ====================

  // Get all users with filters
  getAllUsers: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.enum(["user", "delegate", "supervisor", "admin"]).optional(),
        status: z.enum(["active", "inactive", "suspended", "pending"]).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات لعرض المستخدمين" });
      }
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let whereConditions: any[] = [];

      if (input.search) {
        whereConditions.push(
          like(users.name, `%${input.search}%`)
        );
      }

      if (input.role) {
        whereConditions.push(eq(users.role, input.role));
      }

      if (input.status) {
        whereConditions.push(eq(users.status, input.status));
      }

      let whereClause = undefined;
      if (whereConditions.length > 0) {
        whereClause = and(...whereConditions);
      }

      const total = await db_instance.select().from(users).where(whereClause);
      const results = await db_instance.select().from(users)
        .where(whereClause)
        .limit(input.limit)
        .offset(input.offset);

      return {
        users: results,
        total: total.length,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Get single user details
  getUserById: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const user = await db.getUserById(input.userId);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
      }

      return {
        ...user,
        permissions: user.permissions ? JSON.parse(user.permissions) : [],
      };
    }),

  // Update user role
  updateUserRole: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["user", "delegate", "supervisor", "admin"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Prevent non-super-admins from creating admins
      if (input.role === "admin" && ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "لا يمكنك إنشاء مسؤول جديد",
        });
      }

      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Update role and assign default permissions
      const permissions = ROLE_PERMISSIONS[input.role];

      await db_instance
        .update(users)
        .set({
          role: input.role,
          permissions: JSON.stringify(permissions),
        })
        .where(eq(users.id, input.userId));

      // Log activity
      await db.logUserActivity({
        userId: ctx.user!.id,
        activityType: "update_user_role",
        description: `تم تحديث دور المستخدم ${input.userId} إلى ${input.role}`,
        metadata: JSON.stringify({ targetUserId: input.userId, newRole: input.role }),
      });

      return { success: true };
    }),

  // Update user status
  updateUserStatus: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        status: z.enum(["active", "inactive", "suspended", "pending"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db_instance
        .update(users)
        .set({
          status: input.status,
          notes: input.reason || "",
        })
        .where(eq(users.id, input.userId));

      // Log activity
      await db.logUserActivity({
        userId: ctx.user!.id,
        activityType: "update_user_status",
        description: `تم تحديث حالة المستخدم ${input.userId} إلى ${input.status}`,
        metadata: JSON.stringify({
          targetUserId: input.userId,
          newStatus: input.status,
          reason: input.reason,
        }),
      });

      return { success: true };
    }),

  // Update user permissions
  updateUserPermissions: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        permissions: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db_instance
        .update(users)
        .set({
          permissions: JSON.stringify(input.permissions),
        })
        .where(eq(users.id, input.userId));

      // Log activity
      await db.logUserActivity({
        userId: ctx.user!.id,
        activityType: "update_user_permissions",
        description: `تم تحديث صلاحيات المستخدم ${input.userId}`,
        metadata: JSON.stringify({
          targetUserId: input.userId,
          permissions: input.permissions,
        }),
      });

      return { success: true };
    }),

  // Reset user password
  resetUserPassword: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await db.hashPassword(input.newPassword);
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db_instance
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, input.userId));

      // Log activity
      await db.logUserActivity({
        userId: ctx.user!.id,
        activityType: "reset_user_password",
        description: `تم إعادة تعيين كلمة مرور المستخدم ${input.userId}`,
        metadata: JSON.stringify({ targetUserId: input.userId }),
      });

      return { success: true };
    }),

  // Delete user (soft delete)
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات" });
      }
      
      if (!input.userId || input.userId <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "معرف المستخدم غير صحيح" });
      }
      
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        await db_instance.delete(users).where(eq(users.id, input.userId));
        
        try {
          await db.logUserActivity({
            userId: ctx.user!.id,
            activityType: "delete_user",
            description: `تم حذف المستخدم ${input.userId}`,
            metadata: JSON.stringify({ targetUserId: input.userId }),
          });
        } catch (e) {
          console.error("فشل التسجيل:", e);
        }
        
        return { success: true };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "فشل حذف المستخدم" });
      }
    }),

  // Get user statistics
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات" });
    }
    const db_instance = await db.getDb();
    if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const allUsers = await db_instance.select().from(users) as any[];

    return {
      total: allUsers.length,
      active: allUsers.filter((u) => u.isActive === true).length,
      agents: allUsers.filter((u) => u.role === "delegate").length,
      admins: allUsers.filter((u) => u.role === "admin").length,
    };
  }),

  // Get all users (alias for getAllUsers)
  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().default(1000),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let query = db_instance.select().from(users);
      const allUsers = await query as any[];

      return allUsers;
    }),

  // Update user
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        role: z.string().optional(),
        status: z.string().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات" });
      }
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.email) updateData.email = input.email;
      if (input.phone) updateData.phone = input.phone;
      if (input.role) updateData.role = input.role;
      if (input.status) updateData.status = input.status;
      if (input.address) updateData.address = input.address;

      await db_instance
        .update(users)
        .set(updateData)
        .where(eq(users.id, input.id));

      await db.logUserActivity({
        userId: ctx.user!.id,
        activityType: "update_user",
        description: `تم تحديث بيانات المستخدم ${input.id}`,
        metadata: JSON.stringify({ targetUserId: input.id, changes: updateData }),
      });

      return { success: true };
    }),



  // Get user statistics (legacy name)
  getUserStatistics: protectedProcedure.query(async ({ ctx }) => {
    const db_instance = await db.getDb();
    if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const allUsers = await db_instance.select().from(users) as any[];

    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.status === "active").length,
      inactiveUsers: allUsers.filter((u) => u.status === "inactive").length,
      suspendedUsers: allUsers.filter((u) => u.status === "suspended").length,
      pendingUsers: allUsers.filter((u) => u.status === "pending").length,
      byRole: {
        users: allUsers.filter((u) => u.role === "user").length,
        agents: allUsers.filter((u) => u.role === "agent").length,
        supervisors: allUsers.filter((u) => u.role === "supervisor").length,
        admins: allUsers.filter((u) => u.role === "admin").length,
      },
    };

    return stats;
  }),

  // Get role permissions
  getRolePermissions: protectedProcedure
    .input(z.object({ role: z.enum(["user", "delegate", "supervisor", "admin"]) }))
    .query(({ input }) => {
      return ROLE_PERMISSIONS[input.role];
    }),

  // Get all available permissions
  getAllPermissions: protectedProcedure.query(() => {
    const allPermissions = new Set<string>();
    Object.values(ROLE_PERMISSIONS).forEach((perms) => {
      perms.forEach((p) => allPermissions.add(p));
    });
    return Array.from(allPermissions).sort();
  }),

  // ==================== USER PROFILE ====================

  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user!.id);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return {
      ...user,
      permissions: user.permissions ? JSON.parse(user.permissions) : [],
    };
  }),

  // Update own profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        zipCode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db_instance
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.user!.id));

      return { success: true };
    }),

  // Change own password
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserById(ctx.user!.id);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const passwordMatch = await db.verifyPassword(
        input.currentPassword,
        user.password
      );
      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "كلمة المرور الحالية غير صحيحة",
        });
      }

      const hashedPassword = await db.hashPassword(input.newPassword);
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db_instance
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.user!.id));

      return { success: true };
    }),

  // ==================== INTEGRATION PROCEDURES ====================

  // Get user profile with all related data
  getUserProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user!.id);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        ...user,
        permissions: user.permissions ? JSON.parse(user.permissions) : [],
      };
    }),

  // Get user orders
  getUserOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // This would query orders table filtered by userId
      // For now, return empty array as placeholder
      return {
        orders: [],
        total: 0,
      };
    }),

  // Get user reviews
  getUserReviews: protectedProcedure
    .query(async ({ ctx }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // This would query reviews table filtered by userId
      return {
        reviews: [],
        total: 0,
      };
    }),

  // Get delegate sales data
  getDelegateSales: protectedProcedure
    .input(
      z.object({
        delegateId: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "delegate" && ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Return delegate sales data
      return {
        totalSales: 0,
        totalCommission: 0,
        ordersCount: 0,
        salesData: [],
      };
    }),

  // Get supervisor team data
  getSupervisorTeam: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== "supervisor" && ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Get all delegates under this supervisor
      const teamMembers = await db_instance
        .select()
        .from(users)
        .where(eq(users.role, "delegate"));

      return {
        teamMembers,
        totalTeamMembers: teamMembers.length,
      };
    }),

  // Get user loyalty points
  getUserLoyaltyPoints: protectedProcedure
    .query(async ({ ctx }) => {
      const points = await db.getUserLoyaltyPoints(ctx.user!.id);
      return points || { totalPoints: 0, usedPoints: 0, availablePoints: 0 };
    }),

  // Get user notifications
  getUserNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const notifications = await db.getUserNotifications(ctx.user!.id);
      return notifications || [];
    }),

  // Get user activity log
  getUserActivityLog: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      // This would query activity logs
      return {
        activities: [],
        total: 0,
      };
    }),

  // Get all users for dashboard
  getDashboardUsers: protectedProcedure
    .query(async ({ ctx }) => {
      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const allUsers = await db_instance.select().from(users);

      return {
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter((u: any) => u.status === "active").length,
        newUsers: allUsers.filter((u: any) => {
          const createdDate = new Date(u.createdAt);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate > thirtyDaysAgo;
        }).length,
        users: allUsers,
      };
    }),

  // ==================== BULK IMPORT ====================

  // Import users from Excel/CSV
  importUsersFromFile: protectedProcedure
    .input(
      z.object({
        fileContent: z.string(), // Base64 encoded file content
        fileName: z.string(),
        fileType: z.enum(["csv", "xlsx"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات لاستيراد المستخدمين" });
      }

      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      try {
        // Parse file content based on type
        let rows: any[] = [];
        
        if (input.fileType === "csv") {
          // Parse CSV
          const buffer = Buffer.from(input.fileContent, 'base64');
          const csvContent = buffer.toString('utf-8');
          const lines = csvContent.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index]?.trim() || '';
            });
            rows.push(row);
          }
        } else if (input.fileType === "xlsx") {
          // For XLSX, we would need a library like xlsx
          // For now, return error asking for CSV
          throw new TRPCError({ 
            code: "BAD_REQUEST", 
            message: "يرجى استخدام ملف CSV. دعم XLSX قادم قريباً" 
          });
        }

        // Validate and import rows
        const results = {
          success: 0,
          failed: 0,
          errors: [] as string[],
          importedUserIds: [] as number[],
        };

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          try {
            // Validate required fields
            if (!row.name || !row.email) {
              results.failed++;
              results.errors.push(`الصف ${i + 2}: الاسم والبريد الإلكتروني مطلوبان`);
              continue;
            }

            // Check if email already exists
            const existingUser = await db_instance
              .select()
              .from(users)
              .where(eq(users.email, row.email));

            if (existingUser.length > 0) {
              results.failed++;
              results.errors.push(`الصف ${i + 2}: البريد الإلكتروني ${row.email} موجود بالفعل`);
              continue;
            }

            // Hash password (use email as default password)
            const defaultPassword = row.password || row.email.split('@')[0];
            const hashedPassword = await db.hashPassword(defaultPassword);

            // Insert user
            const result = await db_instance.insert(users).values({
              name: row.name,
              email: row.email,
              phone: row.phone || '',
              address: row.address || '',
              city: row.city || '',
              password: hashedPassword,
              role: (row.role || 'user') as any,
              status: (row.status || 'active') as any,
              isActive: true,
            });

            results.success++;
            results.importedUserIds.push((result as any).insertId);
          } catch (error: any) {
            results.failed++;
            results.errors.push(`الصف ${i + 2}: ${error.message}`);
          }
        }

        // Log the import activity
        await db.logUserActivity({
          userId: ctx.user!.id,
          activityType: "bulk_import_users",
          description: `تم استيراد ${results.success} مستخدم من ملف ${input.fileName}`,
          metadata: JSON.stringify({
            fileName: input.fileName,
            fileType: input.fileType,
            successCount: results.success,
            failureCount: results.failed,
            importedUserIds: results.importedUserIds,
          }),
        });

        return results;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `خطأ في معالجة الملف: ${error.message}`,
        });
      }
    }),

  // ==================== AUDIT LOG ====================

  // Get audit log for user changes
  getAuditLog: protectedProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        activityType: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات لعرض سجل التدقيق" });
      }

      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Query activity logs
      const { userActivityLog } = await import("../drizzle/schema");
      
      let logsQuery = db_instance.select().from(userActivityLog) as any;

      if (input.userId) {
        logsQuery = logsQuery.where(eq(userActivityLog.userId, input.userId));
      }

      const logs = await logsQuery.limit(input.limit).offset(input.offset);

      return {
        logs: logs.map((log: any) => ({
          ...log,
          metadata: log.metadata ? JSON.parse(log.metadata) : {},
        })),
        total: logs.length,
      };
    }),

  // Get detailed audit trail for a specific user
  getUserAuditTrail: protectedProcedure
    .input(
      z.object({
        targetUserId: z.number(),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحيات" });
      }

      const db_instance = await db.getDb();
      if (!db_instance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { userActivityLog } = await import("../drizzle/schema");
      
      // Get all activities related to this user
      const logs = await db_instance
        .select()
        .from(userActivityLog)
        .where(eq(userActivityLog.userId, input.targetUserId))
        .limit(input.limit);

      return logs.map((log: any) => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : {},
      }));
    }),
});
