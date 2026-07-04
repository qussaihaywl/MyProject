import { router, publicProcedure, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';

export const commissionsRouter = router({
  // ==================== WAREHOUSE COMMISSIONS ====================
  
  warehouse: router({
    create: adminProcedure
      .input(z.object({
        warehouseCode: z.string(),
        orderId: z.number().optional(),
        commissionType: z.enum(['percentage', 'fixed']),
        commissionRate: z.number(),
        totalOrderAmount: z.number(),
        commissionAmount: z.number(),
        status: z.enum(['pending', 'approved', 'paid']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createWarehouseCommission({
          warehouseId: 1, // Default warehouse ID
          warehouseCode: input.warehouseCode,
          warehouseName: 'Main Warehouse', // Default warehouse name
          orderId: input.orderId,
          commissionType: input.commissionType,
          commissionRate: input.commissionRate.toString(),
          totalOrderAmount: input.totalOrderAmount.toString(),
          commissionAmount: input.commissionAmount.toString(),
          status: (input.status || 'pending') as any,
          notes: input.notes,
        });
      }),

    getAll: adminProcedure
      .input(z.object({
        warehouseId: z.string().optional(),
        status: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getWarehouseCommissions({
          warehouseId: input?.warehouseId,
          status: input?.status,
        });
      }),

    getById: adminProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getWarehouseCommissionById(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'paid']).optional(),
        commissionAmount: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateWarehouseCommission(input.id, {
          status: input.status as any,
          commissionAmount: input.commissionAmount?.toString(),
          notes: input.notes,
        });
      }),

    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteWarehouseCommission(input);
      }),

    getStats: adminProcedure
      .input(z.string().optional())
      .query(async ({ input }) => {
        return db.getWarehouseCommissionStats(input);
      }),

    getAllStats: adminProcedure
      .query(async () => {
        return db.getAllWarehousesStats();
      }),
  }),

  // ==================== DELEGATE COMMISSIONS ====================

  delegate: router({
    getDelegateCommissions: protectedProcedure
      .input(z.object({
        delegateId: z.number(),
        month: z.number().optional(),
        year: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.getDelegateCommissions({
          delegateName: undefined,
          status: undefined,
        });
      }),

    create: adminProcedure
      .input(z.object({
        delegateName: z.string(),
        orderId: z.number().optional(),
        commissionType: z.enum(['percentage', 'fixed']),
        commissionRate: z.number(),
        totalOrderAmount: z.number(),
        commissionAmount: z.number(),
        status: z.enum(['pending', 'approved', 'paid']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createDelegateCommission({
          delegateId: 1, // Default delegate ID
          delegateName: input.delegateName,
          orderId: input.orderId,
          commissionType: input.commissionType,
          commissionRate: input.commissionRate.toString(),
          totalOrderAmount: input.totalOrderAmount.toString(),
          commissionAmount: input.commissionAmount.toString(),
          status: (input.status || 'pending') as any,
          notes: input.notes,
        });
      }),

    getAll: adminProcedure
      .input(z.object({
        delegateName: z.string().optional(),
        status: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getDelegateCommissions({
          delegateName: input?.delegateName,
          status: input?.status,
        });
      }),

    getById: adminProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getDelegateCommissionById(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'approved', 'paid']).optional(),
        commissionAmount: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateDelegateCommission(input.id, {
          status: input.status as any,
          commissionAmount: input.commissionAmount?.toString(),
          notes: input.notes,
        });
      }),

    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteDelegateCommission(input);
      }),

    getStats: adminProcedure
      .input(z.string().optional())
      .query(async ({ input }) => {
        return db.getDelegateCommissionStats(input);
      }),

    getAllStats: adminProcedure
      .query(async () => {
        return db.getAllDelegatesStats();
      }),
  }),
});
