import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendProductToGoogleSheets, testGoogleSheetsConnection } from './googleSheets';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('Google Sheets Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set webhook URL for testing
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/d/test-id/usercopy';
  });

  afterEach(() => {
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  });

  describe('sendProductToGoogleSheets', () => {
    it('should send product data successfully', async () => {
      // Mock successful response
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const productData = {
        name: 'منتج اختبار',
        price: 50,
        description: 'وصف المنتج',
        colors: 'أحمر، أزرق',
        sizes: 'S, M, L',
        weight: '500g',
        warehouseCode: 'WH-001',
        categoryId: 1,
        image: 'https://example.com/image.jpg',
      };

      const result = await sendProductToGoogleSheets(productData);

      expect(result.success).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledOnce();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://script.google.com/macros/d/test-id/usercopy',
        expect.objectContaining({
          name: 'منتج اختبار',
          price: 50,
        }),
        expect.any(Object)
      );
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const productData = {
        name: 'منتج اختبار',
        price: 50,
        categoryId: 1,
      };

      const result = await sendProductToGoogleSheets(productData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should work without webhook URL configured', async () => {
      delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;

      const productData = {
        name: 'منتج اختبار',
        price: 50,
        categoryId: 1,
      };

      const result = await sendProductToGoogleSheets(productData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No webhook URL configured');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should include all product fields in payload', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const productData = {
        name: 'فستان أنيق',
        price: 150,
        description: 'فستان صيفي جميل',
        colors: 'أبيض، أسود',
        sizes: 'XS, S, M, L, XL',
        weight: '300g',
        warehouseCode: 'WH-002',
        categoryId: 2,
        image: 'https://example.com/dress.jpg',
      };

      await sendProductToGoogleSheets(productData);

      const callArgs = mockedAxios.post.mock.calls[0][1];
      expect(callArgs.name).toBe('فستان أنيق');
      expect(callArgs.price).toBe(150);
      expect(callArgs.description).toBe('فستان صيفي جميل');
      expect(callArgs.colors).toBe('أبيض، أسود');
      expect(callArgs.sizes).toBe('XS, S, M, L, XL');
      expect(callArgs.weight).toBe('300g');
      expect(callArgs.warehouseCode).toBe('WH-002');
      expect(callArgs.categoryId).toBe(2);
      expect(callArgs.image).toBe('https://example.com/dress.jpg');
    });

    it('should handle missing optional fields', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const productData = {
        name: 'منتج بسيط',
        price: 25,
        categoryId: 1,
      };

      const result = await sendProductToGoogleSheets(productData);

      expect(result.success).toBe(true);
      const callArgs = mockedAxios.post.mock.calls[0][1];
      expect(callArgs.description).toBe('');
      expect(callArgs.colors).toBe('');
      expect(callArgs.sizes).toBe('');
    });

    it('should format timestamp correctly', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const productData = {
        name: 'منتج',
        price: 100,
        categoryId: 1,
      };

      await sendProductToGoogleSheets(productData);

      const callArgs = mockedAxios.post.mock.calls[0][1];
      expect(callArgs.timestamp).toBeDefined();
      expect(typeof callArgs.timestamp).toBe('string');
    });

    it('should timeout after 10 seconds', async () => {
      mockedAxios.post.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 15000))
      );

      const productData = {
        name: 'منتج',
        price: 100,
        categoryId: 1,
      };

      // Verify that axios is called with timeout option
      await sendProductToGoogleSheets(productData);
      
      const callOptions = mockedAxios.post.mock.calls[0][2];
      expect(callOptions.timeout).toBe(10000);
    }, { timeout: 20000 });
  });

  describe('testGoogleSheetsConnection', () => {
    it('should test connection successfully', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const result = await testGoogleSheetsConnection();

      expect(result.success).toBe(true);
      expect(result.message).toContain('الاتصال يعمل');
    });

    it('should handle connection errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Connection failed'));

      const result = await testGoogleSheetsConnection();

      expect(result.success).toBe(false);
      expect(result.message).toContain('فشل الاتصال');
    });

    it('should return error when webhook URL not configured', async () => {
      delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;

      const result = await testGoogleSheetsConnection();

      expect(result.success).toBe(false);
      expect(result.message).toContain('لم يتم تعيين');
    });

    it('should send test payload with correct structure', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      await testGoogleSheetsConnection();

      const callArgs = mockedAxios.post.mock.calls[0][1];
      expect(callArgs.test).toBe(true);
      expect(callArgs.message).toBeDefined();
    });

    it('should have 5 second timeout', async () => {
      mockedAxios.post.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 10000))
      );

      // Verify that axios is called with timeout option
      await testGoogleSheetsConnection();
      
      const callOptions = mockedAxios.post.mock.calls[0][2];
      expect(callOptions.timeout).toBe(5000);
    }, { timeout: 15000 });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple products in sequence', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const products = [
        { name: 'منتج 1', price: 50, categoryId: 1 },
        { name: 'منتج 2', price: 100, categoryId: 2 },
        { name: 'منتج 3', price: 150, categoryId: 1 },
      ];

      const results = await Promise.all(
        products.map(p => sendProductToGoogleSheets(p as any))
      );

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent requests', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const productData = {
        name: 'منتج متزامن',
        price: 75,
        categoryId: 1,
      };

      const results = await Promise.all([
        sendProductToGoogleSheets(productData),
        sendProductToGoogleSheets(productData),
        sendProductToGoogleSheets(productData),
      ]);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });

    it('should preserve data integrity across multiple sends', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const product1 = {
        name: 'منتج أول',
        price: 50,
        description: 'أول منتج',
        categoryId: 1,
      };

      const product2 = {
        name: 'منتج ثاني',
        price: 100,
        description: 'ثاني منتج',
        categoryId: 2,
      };

      await sendProductToGoogleSheets(product1);
      await sendProductToGoogleSheets(product2);

      const call1 = mockedAxios.post.mock.calls[0][1];
      const call2 = mockedAxios.post.mock.calls[1][1];

      expect(call1.name).toBe('منتج أول');
      expect(call2.name).toBe('منتج ثاني');
      expect(call1.price).toBe(50);
      expect(call2.price).toBe(100);
    });
  });
});
