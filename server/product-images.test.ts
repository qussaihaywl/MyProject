import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from './db';

describe('Product Images Handling', () => {
  let testProductId: number;
  const testImageUrl = 'https://example.com/test-product-image.jpg';
  const defaultImage = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663711816913/PbM5MRSPLRoPndpAwMBnHr/rose-placeholder-product-image.webp';

  beforeAll(async () => {
    console.log('Setting up test environment for product images...');
  });

  afterAll(async () => {
    if (testProductId) {
      try {
        await db.deleteProduct(testProductId);
      } catch (e) {
        console.log('Cleanup completed for test product');
      }
    }
  });

  it('should create a product with image URL', async () => {
    const productData = {
      name: 'Product with Image',
      description: 'Test product with image',
      price: 100,
      categoryId: 1,
      image: testImageUrl,
      warehouseCode: 'WH001',
    };

    const result = await db.createProduct(productData);
    testProductId = result.id;

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    expect(result.image).toBe(testImageUrl);
  });

  it('should retrieve product with correct image', async () => {
    const product = await db.getProductById(testProductId);

    expect(product).toBeDefined();
    expect(product?.image).toBe(testImageUrl);
    expect(product?.image).not.toBe(defaultImage);
  });

  it('should store image in images array', async () => {
    const product = await db.getProductById(testProductId);

    expect(product).toBeDefined();
    if (product?.images) {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      expect(Array.isArray(images)).toBe(true);
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toBe(testImageUrl);
    }
  });

  it('should create product with default image if no image provided', async () => {
    const productData = {
      name: 'Product without Image',
      description: 'Test product without image',
      price: 50,
      categoryId: 1,
      warehouseCode: 'WH001',
    };

    const result = await db.createProduct(productData);
    const noImageProductId = result.id;

    expect(result).toBeDefined();
    expect(result.image).toBe(defaultImage);

    // Cleanup
    await db.deleteProduct(noImageProductId);
  });

  it('should update product image', async () => {
    const newImageUrl = 'https://example.com/updated-image.jpg';
    
    await db.updateProduct(testProductId, {
      image: newImageUrl,
    });

    const updatedProduct = await db.getProductById(testProductId);
    expect(updatedProduct?.image).toBe(newImageUrl);
  });

  it('should handle multiple images', async () => {
    const multipleImages = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];

    const productData = {
      name: 'Product with Multiple Images',
      description: 'Test product with multiple images',
      price: 150,
      categoryId: 1,
      image: multipleImages[0],
      images: multipleImages,
      warehouseCode: 'WH001',
    };

    const result = await db.createProduct(productData);
    const multiImageProductId = result.id;

    const product = await db.getProductById(multiImageProductId);
    if (product?.images) {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      expect(images.length).toBeGreaterThanOrEqual(multipleImages.length);
      expect(images[0]).toBe(multipleImages[0]);
    }

    // Cleanup
    await db.deleteProduct(multiImageProductId);
  });

  it('should not duplicate image in images array', async () => {
    const imageUrl = 'https://example.com/unique-image.jpg';
    
    const productData = {
      name: 'Product with Unique Image',
      description: 'Test product',
      price: 75,
      categoryId: 1,
      image: imageUrl,
      images: [imageUrl],
      warehouseCode: 'WH001',
    };

    const result = await db.createProduct(productData);
    const uniqueImageProductId = result.id;

    const product = await db.getProductById(uniqueImageProductId);
    if (product?.images) {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      const imageCount = images.filter((img: string) => img === imageUrl).length;
      expect(imageCount).toBe(1);
    }

    // Cleanup
    await db.deleteProduct(uniqueImageProductId);
  });

  it('should retrieve all products with correct images', async () => {
    const products = await db.getProducts(undefined, 100);

    expect(Array.isArray(products)).toBe(true);
    
    // Check that products have images
    const productsWithImages = products.filter((p: any) => p.image && p.image.trim());
    expect(productsWithImages.length).toBeGreaterThan(0);

    // Verify images are not empty strings
    for (const product of productsWithImages) {
      expect(product.image).toBeTruthy();
      expect(product.image.trim().length).toBeGreaterThan(0);
    }
  });

  it('should handle image URL validation', async () => {
    const validImageUrl = 'https://example.com/valid-image.jpg';
    
    const productData = {
      name: 'Product with Valid Image',
      description: 'Test product',
      price: 80,
      categoryId: 1,
      image: validImageUrl,
      warehouseCode: 'WH001',
    };

    const result = await db.createProduct(productData);
    const validImageProductId = result.id;

    const product = await db.getProductById(validImageProductId);
    expect(product?.image).toBe(validImageUrl);
    expect(product?.image.startsWith('http')).toBe(true);

    // Cleanup
    await db.deleteProduct(validImageProductId);
  });
});
