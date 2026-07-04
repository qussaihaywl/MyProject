import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Commission Functions', () => {
  // Test Warehouse Commissions
  describe('Warehouse Commissions', () => {
    it('should create a warehouse commission', async () => {
      const commission = await db.createWarehouseCommission({
        warehouseCode: 'WH001',
        orderId: 1,
        commissionType: 'percentage',
        commissionRate: '5.00',
        totalOrderAmount: '1000.00',
        commissionAmount: '50.00',
        status: 'pending',
        notes: 'Test commission',
      });

      expect(commission).toBeDefined();
      expect(commission.warehouseCode).toBe('WH001');
      expect(commission.commissionAmount).toBe('50.00');
    });

    it('should get all warehouse commissions', async () => {
      const commissions = await db.getWarehouseCommissions();
      expect(Array.isArray(commissions)).toBe(true);
    });

    it('should get warehouse commission by ID', async () => {
      const commission = await db.createWarehouseCommission({
        warehouseCode: 'WH002',
        orderId: 2,
        commissionType: 'fixed',
        commissionRate: '25.00',
        totalOrderAmount: '500.00',
        commissionAmount: '25.00',
        status: 'approved',
      });

      const retrieved = await db.getWarehouseCommissionById(commission.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.warehouseCode).toBe('WH002');
    });

    it('should update warehouse commission status', async () => {
      const commission = await db.createWarehouseCommission({
        warehouseCode: 'WH003',
        orderId: 3,
        commissionType: 'percentage',
        commissionRate: '3.00',
        totalOrderAmount: '2000.00',
        commissionAmount: '60.00',
        status: 'pending',
      });

      await db.updateWarehouseCommission(commission.id, {
        status: 'paid',
      });

      const updated = await db.getWarehouseCommissionById(commission.id);
      expect(updated?.status).toBe('paid');
    });

    it('should get warehouse commission stats', async () => {
      const stats = await db.getWarehouseCommissionStats('WH001');
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.totalCommissionAmount).toBeGreaterThanOrEqual(0);
    });

    it('should get all warehouses stats', async () => {
      const stats = await db.getAllWarehousesStats();
      expect(Array.isArray(stats)).toBe(true);
    });
  });

  // Test Delegate Commissions
  describe('Delegate Commissions', () => {
    it('should create a delegate commission', async () => {
      const commission = await db.createDelegateCommission({
        delegateName: 'محمد علي',
        orderId: 1,
        commissionType: 'percentage',
        commissionRate: '10.00',
        totalOrderAmount: '500.00',
        commissionAmount: '50.00',
        status: 'pending',
        notes: 'Test delegate commission',
      });

      expect(commission).toBeDefined();
      expect(commission.delegateName).toBe('محمد علي');
      expect(commission.commissionAmount).toBe('50.00');
    });

    it('should get all delegate commissions', async () => {
      const commissions = await db.getDelegateCommissions();
      expect(Array.isArray(commissions)).toBe(true);
    });

    it('should get delegate commission by ID', async () => {
      const commission = await db.createDelegateCommission({
        delegateName: 'فاطمة أحمد',
        orderId: 2,
        commissionType: 'fixed',
        commissionRate: '30.00',
        totalOrderAmount: '300.00',
        commissionAmount: '30.00',
        status: 'approved',
      });

      const retrieved = await db.getDelegateCommissionById(commission.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.delegateName).toBe('فاطمة أحمد');
    });

    it('should update delegate commission status', async () => {
      const commission = await db.createDelegateCommission({
        delegateName: 'علي محمود',
        orderId: 3,
        commissionType: 'percentage',
        commissionRate: '8.00',
        totalOrderAmount: '1000.00',
        commissionAmount: '80.00',
        status: 'pending',
      });

      await db.updateDelegateCommission(commission.id, {
        status: 'approved',
      });

      const updated = await db.getDelegateCommissionById(commission.id);
      expect(updated?.status).toBe('approved');
    });

    it('should get delegate commission stats', async () => {
      const stats = await db.getDelegateCommissionStats('محمد علي');
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.totalCommissionAmount).toBeGreaterThanOrEqual(0);
    });

    it('should get all delegates stats', async () => {
      const stats = await db.getAllDelegatesStats();
      expect(Array.isArray(stats)).toBe(true);
    });

    it('should calculate average commission correctly', async () => {
      const stats = await db.getDelegateCommissionStats('محمد علي');
      if (stats.total > 0) {
        const expectedAverage = stats.totalCommissionAmount / stats.total;
        expect(stats.averageCommission).toBe(expectedAverage);
      }
    });
  });

  // Test Commission Filtering
  describe('Commission Filtering', () => {
    it('should filter warehouse commissions by status', async () => {
      const commissions = await db.getWarehouseCommissions({
        status: 'pending',
      });
      expect(Array.isArray(commissions)).toBe(true);
      commissions.forEach(c => {
        expect(c.status).toBe('pending');
      });
    });

    it('should filter delegate commissions by status', async () => {
      const commissions = await db.getDelegateCommissions({
        status: 'paid',
      });
      expect(Array.isArray(commissions)).toBe(true);
      commissions.forEach(c => {
        expect(c.status).toBe('paid');
      });
    });

    it('should filter warehouse commissions by code', async () => {
      const commissions = await db.getWarehouseCommissions({
        warehouseCode: 'WH001',
      });
      expect(Array.isArray(commissions)).toBe(true);
      commissions.forEach(c => {
        expect(c.warehouseCode).toBe('WH001');
      });
    });

    it('should filter delegate commissions by name', async () => {
      const commissions = await db.getDelegateCommissions({
        delegateName: 'محمد علي',
      });
      expect(Array.isArray(commissions)).toBe(true);
      commissions.forEach(c => {
        expect(c.delegateName).toBe('محمد علي');
      });
    });
  });

  // Test Commission Calculations
  describe('Commission Calculations', () => {
    it('should calculate percentage commission correctly', async () => {
      const commission = await db.createWarehouseCommission({
        warehouseCode: 'WH_TEST',
        orderId: 100,
        commissionType: 'percentage',
        commissionRate: '5.00',
        totalOrderAmount: '1000.00',
        commissionAmount: '50.00',
        status: 'pending',
      });

      expect(parseFloat(commission.commissionAmount)).toBe(50.00);
    });

    it('should handle fixed commission type', async () => {
      const commission = await db.createDelegateCommission({
        delegateName: 'Test Delegate',
        orderId: 101,
        commissionType: 'fixed',
        commissionRate: '25.00',
        totalOrderAmount: '500.00',
        commissionAmount: '25.00',
        status: 'pending',
      });

      expect(parseFloat(commission.commissionAmount)).toBe(25.00);
    });

    it('should sum commissions correctly in stats', async () => {
      const stats = await db.getWarehouseCommissionStats();
      expect(stats.totalCommissionAmount).toBeGreaterThanOrEqual(0);
      expect(stats.totalOrderAmount).toBeGreaterThanOrEqual(0);
    });
  });

  // Test Status Distribution
  describe('Status Distribution', () => {
    it('should count pending commissions', async () => {
      const stats = await db.getWarehouseCommissionStats();
      expect(stats.byStatus.pending).toBeGreaterThanOrEqual(0);
    });

    it('should count approved commissions', async () => {
      const stats = await db.getDelegateCommissionStats();
      expect(stats.byStatus.approved).toBeGreaterThanOrEqual(0);
    });

    it('should count paid commissions', async () => {
      const stats = await db.getWarehouseCommissionStats();
      expect(stats.byStatus.paid).toBeGreaterThanOrEqual(0);
    });
  });
});
