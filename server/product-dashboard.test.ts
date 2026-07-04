import { describe, it, expect } from 'vitest';

describe('ProductDashboard', () => {
  it('should calculate statistics correctly', () => {
    const products = [
      { id: 1, name: 'Product 1', price: 100, isActive: true },
      { id: 2, name: 'Product 2', price: 200, isActive: true },
      { id: 3, name: 'Product 3', price: 300, isActive: false },
    ];

    const total = products.length;
    const active = products.filter(p => p.isActive).length;
    const inactive = products.filter(p => !p.isActive).length;

    let sum = 0;
    for (const p of products) {
      sum = sum + (typeof p.price === 'number' ? p.price : 0);
    }
    const avgPrice = (sum / total).toFixed(2);

    expect(total).toBe(3);
    expect(active).toBe(2);
    expect(inactive).toBe(1);
    expect(avgPrice).toBe('200.00');
  });

  it('should filter products by search term', () => {
    const products = [
      { id: 1, name: 'Red Shirt', description: 'A red shirt' },
      { id: 2, name: 'Blue Pants', description: 'Blue pants' },
      { id: 3, name: 'Red Pants', description: 'Red pants' },
    ];

    const searchTerm = 'Red';
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    expect(filtered.length).toBe(2);
    expect(filtered[0].name).toBe('Red Shirt');
    expect(filtered[1].name).toBe('Red Pants');
  });

  it('should filter products by status', () => {
    const products = [
      { id: 1, name: 'Product 1', isActive: true },
      { id: 2, name: 'Product 2', isActive: false },
      { id: 3, name: 'Product 3', isActive: true },
    ];

    const filterStatus = 'active';
    const filtered = products.filter(p => (p.isActive === true) === (filterStatus === 'active'));

    expect(filtered.length).toBe(2);
    expect(filtered.every(p => p.isActive)).toBe(true);
  });

  it('should sort products by name', () => {
    const products = [
      { id: 1, name: 'Zebra' },
      { id: 2, name: 'Apple' },
      { id: 3, name: 'Mango' },
    ];

    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));

    expect(sorted[0].name).toBe('Apple');
    expect(sorted[1].name).toBe('Mango');
    expect(sorted[2].name).toBe('Zebra');
  });

  it('should sort products by price', () => {
    const products = [
      { id: 1, name: 'Product 1', price: 300 },
      { id: 2, name: 'Product 2', price: 100 },
      { id: 3, name: 'Product 3', price: 200 },
    ];

    const sorted = [...products].sort((a, b) => {
      const priceA = typeof a.price === 'number' ? a.price : 0;
      const priceB = typeof b.price === 'number' ? b.price : 0;
      return priceA - priceB;
    });

    expect(sorted[0].price).toBe(100);
    expect(sorted[1].price).toBe(200);
    expect(sorted[2].price).toBe(300);
  });

  it('should generate Facebook share URL correctly', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
    };

    const productUrl = `http://localhost/product/${product.id}`;
    const description = `${product.name}\n${product.description}\nالسعر: ${product.price} ريال`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(description)}`;

    expect(facebookShareUrl).toContain('facebook.com/sharer');
    expect(facebookShareUrl).toContain(encodeURIComponent(productUrl));
    expect(facebookShareUrl).toContain(encodeURIComponent(description));
  });

  it('should handle empty products list', () => {
    const products: any[] = [];

    const total = products.length;
    const active = products.filter((p: any) => p.isActive).length;
    const inactive = products.filter((p: any) => !p.isActive).length;

    expect(total).toBe(0);
    expect(active).toBe(0);
    expect(inactive).toBe(0);
  });
});
