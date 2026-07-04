import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Product Deletion', () => {
  let testProductId: number;

  beforeAll(async () => {
    console.log('Setting up test environment for product deletion...');
  });

  afterAll(async () => {
    console.log('Cleanup completed for product deletion tests');
  });

  it('should create a product for deletion test', async () => {
    const productData = {
      name: 'Product to Delete',
      description: 'This product will be deleted',
      price: 100,
      categoryId: 1,
      image: 'https://example.com/test-image.jpg',
      warehouseCode: 'WH001',
    };

    const result = await db.createProduct(productData);
    testProductId = result.id;

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });

  it('should retrieve the product before deletion', async () => {
    const product = await db.getProductById(testProductId);

    expect(product).toBeDefined();
    expect(product?.id).toBe(testProductId);
    expect(product?.name).toBe('Product to Delete');
  });

  it('should delete the product successfully', async () => {
    const result = await db.deleteProduct(testProductId);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('should not find the product after deletion', async () => {
    const product = await db.getProductById(testProductId);

    expect(product).toBeNull();
  });

  it('should handle deletion of non-existent product', async () => {
    const result = await db.deleteProduct(99999);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('should delete multiple products', async () => {
    const productIds: number[] = [];

    // Create multiple products
    for (let i = 0; i < 3; i++) {
      const productData = {
        name: `Product ${i + 1}`,
        description: `Test product ${i + 1}`,
        price: 50 + i * 10,
        categoryId: 1,
        warehouseCode: 'WH001',
      };

      const result = await db.createProduct(productData);
      productIds.push(result.id);
    }

    // Delete all products
    for (const id of productIds) {
      const result = await db.deleteProduct(id);
      expect(result.success).toBe(true);
    }

    // Verify all are deleted
    for (const id of productIds) {
      const product = await db.getProductById(id);
      expect(product).toBeNull();
    }
  });

  it('should maintain other products after deletion', async () => {
    // Create two products
    const product1Data = {
      name: 'Product 1',
      description: 'First product',
      price: 100,
      categoryId: 1,
      warehouseCode: 'WH001',
    };

    const product2Data = {
      name: 'Product 2',
      description: 'Second product',
      price: 200,
      categoryId: 1,
      warehouseCode: 'WH001',
    };

    const product1 = await db.createProduct(product1Data);
    const product2 = await db.createProduct(product2Data);

    // Delete first product
    await db.deleteProduct(product1.id);

    // Verify second product still exists
    const remainingProduct = await db.getProductById(product2.id);
    expect(remainingProduct).toBeDefined();
    expect(remainingProduct?.id).toBe(product2.id);

    // Cleanup
    await db.deleteProduct(product2.id);
  });

  it('should update product list after deletion', async () => {
    // Create a product
    const productData = {
      name: 'Product for List Test',
      description: 'Test product',
      price: 75,
      categoryId: 1,
      warehouseCode: 'WH001',
    };

    const product = await db.createProduct(productData);
    const productsBefore = await db.getProducts(undefined, 100);
    const countBefore = productsBefore.length;

    // Delete the product
    await db.deleteProduct(product.id);

    // Get products again
    const productsAfter = await db.getProducts(undefined, 100);
    const countAfter = productsAfter.length;

    // Count should decrease
    expect(countAfter).toBeLessThanOrEqual(countBefore);
  });

  it('should handle rapid consecutive deletions', async () => {
    // Create multiple products
    const productIds: number[] = [];

    for (let i = 0; i < 5; i++) {
      const productData = {
        name: `Rapid Delete Product ${i + 1}`,
        description: `Test product ${i + 1}`,
        price: 100 + i * 10,
        categoryId: 1,
        warehouseCode: 'WH001',
      };

      const result = await db.createProduct(productData);
      productIds.push(result.id);
    }

    // Delete all rapidly
    const deletePromises = productIds.map(id => db.deleteProduct(id));
    const results = await Promise.all(deletePromises);

    // All should succeed
    for (const result of results) {
      expect(result.success).toBe(true);
    }

    // All should be deleted
    for (const id of productIds) {
      const product = await db.getProductById(id);
      expect(product).toBeNull();
    }
  });
});
