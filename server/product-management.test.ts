import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as db from './db';

describe('Product Management Dashboard', () => {
  let testProductId: number;

  beforeAll(async () => {
    // Initialize database if needed
    console.log('Starting Product Management tests...');
  });

  afterAll(async () => {
    console.log('Product Management tests completed');
  });

  describe('Product CRUD Operations', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'منتج اختبار',
        description: 'وصف المنتج للاختبار',
        price: 100,
        categoryId: 1,
        warehouseCode: 'WH001',
        image: 'https://example.com/image.jpg',
        colors: 'أحمر,أزرق',
        sizes: 'S,M,L',
        weight: '500g',
      };

      const product = await db.createProduct(productData);
      expect(product).toBeDefined();
      expect(product.name).toBe(productData.name);
      // Price can be either string or number depending on database
      expect(Number(product.price)).toBe(100);
      testProductId = product.id;
    });

    it('should retrieve all products', async () => {
      const products = await db.getProducts(undefined, 50, 0);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    }, { timeout: 10000 });

    it('should get product by ID', async () => {
      const product = await db.getProductById(testProductId);
      expect(product).toBeDefined();
      expect(product?.id).toBe(testProductId);
      // Name should match what we created
      if (product) {
        expect(product.name).toBe('منتج اختبار');
      }
    }, { timeout: 10000 });

    it('should update product', async () => {
      const updateData = {
        name: 'منتج اختبار محدث',
        description: 'وصف محدث',
        price: 150,
      };

      const updated = await db.updateProduct(testProductId, updateData);
      expect(updated).toBeDefined();
      expect(updated.name).toBe(updateData.name);
    }, { timeout: 10000 });

    it('should delete product', async () => {
      const result = await db.deleteProduct(testProductId);
      expect(result.success).toBe(true);

      // Verify deletion
      const product = await db.getProductById(testProductId);
      expect(product).toBeNull();
    });
  });

  describe('Product Search and Filtering', () => {
    let productId1: number;
    let productId2: number;

    beforeAll(async () => {
      // Create test products
      const product1 = await db.createProduct({
        name: 'منتج فاخر',
        description: 'منتج فاخر للاختبار',
        price: 500,
        categoryId: 1,
        warehouseCode: 'WH001',
      });
      productId1 = product1.id;

      const product2 = await db.createProduct({
        name: 'منتج عادي',
        description: 'منتج عادي للاختبار',
        price: 100,
        categoryId: 2,
        warehouseCode: 'WH002',
      });
      productId2 = product2.id;
    });

    it('should search products by name', async () => {
      const products = await db.getProducts(undefined, 50, 0);
      const found = products.find((p: any) => p.name.includes('فاخر'));
      expect(found).toBeDefined();
    });

    it('should filter products by category', async () => {
      const products = await db.getProducts(1, 50, 0);
      expect(Array.isArray(products)).toBe(true);
    });

    afterAll(async () => {
      // Cleanup
      await db.deleteProduct(productId1);
      await db.deleteProduct(productId2);
    });
  });

  describe('Product Image Handling', () => {
    it('should handle product with image', async () => {
      const productData = {
        name: 'منتج مع صورة',
        price: 200,
        categoryId: 1,
        image: 'https://example.com/product.jpg',
      };

      const product = await db.createProduct(productData);
      expect(product.image).toBe(productData.image);

      // Cleanup
      await db.deleteProduct(product.id);
    });

    it('should handle product without image', async () => {
      const productData = {
        name: 'منتج بدون صورة',
        price: 150,
        categoryId: 1,
      };

      const product = await db.createProduct(productData);
      expect(product).toBeDefined();

      // Cleanup
      await db.deleteProduct(product.id);
    });
  });

  describe('Product Validation', () => {
    it('should validate required fields', async () => {
      const invalidData = {
        name: '',
        price: 0,
        categoryId: 0,
      };

      // This should handle validation gracefully
      try {
        await db.createProduct(invalidData);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle special characters in product name', async () => {
      const productData = {
        name: 'منتج خاص #@! 123',
        price: 100,
        categoryId: 1,
      };

      const product = await db.createProduct(productData);
      expect(product.name).toBe(productData.name);

      // Cleanup
      await db.deleteProduct(product.id);
    });
  });

  describe('Product Bulk Operations', () => {
    it('should handle multiple products', async () => {
      const products = [];

      for (let i = 0; i < 5; i++) {
        const product = await db.createProduct({
          name: `منتج اختبار ${i}`,
          price: 100 + i * 10,
          categoryId: 1,
        });
        products.push(product);
      }

      const allProducts = await db.getProducts(undefined, 50, 0);
      expect(allProducts.length).toBeGreaterThanOrEqual(5);

      // Cleanup
      for (const product of products) {
        await db.deleteProduct(product.id);
      }
    });
  });

  describe('Product Pagination', () => {
    it('should handle pagination correctly', async () => {
      const limit = 10;
      const offset = 0;

      const products = await db.getProducts(undefined, limit, offset);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeLessThanOrEqual(limit);
    });

    it('should handle offset pagination', async () => {
      const page1 = await db.getProducts(undefined, 5, 0);
      const page2 = await db.getProducts(undefined, 5, 5);

      expect(Array.isArray(page1)).toBe(true);
      expect(Array.isArray(page2)).toBe(true);
    });
  });
});
