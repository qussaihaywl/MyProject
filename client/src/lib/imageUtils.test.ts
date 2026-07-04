import { describe, it, expect } from 'vitest';
import { getProductImages, getFirstProductImage, DEFAULT_PRODUCT_IMAGE } from './imageUtils';

describe('imageUtils', () => {
  describe('getProductImages', () => {
    it('يجب أن يرجع الصور من حقل images إذا كانت موجودة', () => {
      const product = {
        image: 'https://example.com/main.jpg',
        images: JSON.stringify(['https://example.com/1.jpg', 'https://example.com/2.jpg']),
      };
      const images = getProductImages(product);
      expect(images).toContain('https://example.com/1.jpg');
      expect(images).toContain('https://example.com/2.jpg');
      expect(images.length).toBeGreaterThanOrEqual(2);
    });

    it('يجب أن يرجع الصورة الرئيسية إذا لم يكن هناك حقل images', () => {
      const product = {
        image: 'https://example.com/main.jpg',
      };
      const images = getProductImages(product);
      expect(images).toEqual(['https://example.com/main.jpg']);
    });

    it('يجب أن يرجع الصورة الافتراضية إذا لم تكن هناك صور', () => {
      const product = {};
      const images = getProductImages(product);
      expect(images).toEqual([DEFAULT_PRODUCT_IMAGE]);
    });

    it('يجب أن يتعامل مع حقل images كمصفوفة مباشرة', () => {
      const product = {
        image: 'https://example.com/main.jpg',
        images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
      };
      const images = getProductImages(product);
      expect(images).toContain('https://example.com/1.jpg');
      expect(images).toContain('https://example.com/2.jpg');
      expect(images.length).toBeGreaterThanOrEqual(2);
    });

    it('يجب أن يتجاهل الصور الفارغة', () => {
      const product = {
        image: 'https://example.com/main.jpg',
        images: JSON.stringify(['', 'https://example.com/1.jpg', '  ']),
      };
      const images = getProductImages(product);
      expect(images).toContain('https://example.com/1.jpg');
      expect(images).not.toContain('');
      expect(images).not.toContain('  ');
    });

    it('يجب أن يضيف الصورة الرئيسية إذا لم تكن موجودة في images', () => {
      const product = {
        image: 'https://example.com/main.jpg',
        images: JSON.stringify(['https://example.com/1.jpg']),
      };
      const images = getProductImages(product);
      expect(images).toContain('https://example.com/main.jpg');
    });

    it('يجب أن يتعامل مع JSON غير صحيح', () => {
      const product = {
        image: 'https://example.com/main.jpg',
        images: 'invalid json',
      };
      const images = getProductImages(product);
      expect(images).toEqual(['https://example.com/main.jpg']);
    });

    it('يجب أن يرجع الصورة الافتراضية للصور الفارغة', () => {
      const product = {
        images: JSON.stringify([]),
      };
      const images = getProductImages(product);
      expect(images).toEqual([DEFAULT_PRODUCT_IMAGE]);
    });
  });

  describe('getFirstProductImage', () => {
    it('يجب أن يرجع الصورة الأولى من القائمة', () => {
      const product = {
        image: 'https://example.com/main.jpg',
        images: JSON.stringify(['https://example.com/1.jpg', 'https://example.com/2.jpg']),
      };
      const image = getFirstProductImage(product);
      expect(image).toBe('https://example.com/1.jpg');
    });

    it('يجب أن يرجع الصورة الرئيسية إذا لم يكن هناك صور أخرى', () => {
      const product = {
        image: 'https://example.com/main.jpg',
      };
      const image = getFirstProductImage(product);
      expect(image).toBe('https://example.com/main.jpg');
    });

    it('يجب أن يرجع الصورة الافتراضية إذا لم تكن هناك صور', () => {
      const product = {};
      const image = getFirstProductImage(product);
      expect(image).toBe(DEFAULT_PRODUCT_IMAGE);
    });

    it('يجب أن يتعامل مع الصور الفارغة', () => {
      const product = {
        image: '',
        images: JSON.stringify([]),
      };
      const image = getFirstProductImage(product);
      expect(image).toBe(DEFAULT_PRODUCT_IMAGE);
    });
  });

  describe('DEFAULT_PRODUCT_IMAGE', () => {
    it('يجب أن يكون رابطاً صحيحاً', () => {
      expect(DEFAULT_PRODUCT_IMAGE).toMatch(/^https?:\/\//);
    });

    it('يجب أن يكون موجوداً ومعرفاً', () => {
      expect(DEFAULT_PRODUCT_IMAGE).toBeDefined();
      expect(DEFAULT_PRODUCT_IMAGE.length).toBeGreaterThan(0);
    });
  });
});
