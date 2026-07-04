import { getDb } from './db';
import { 
  categories, 
  products, 
  warehouses, 
  discountCodes,
  groupChatRooms,
  groupChatMembers
} from '../drizzle/schema';

export async function seedDatabase() {
  const db = await getDb();
  if (!db) {
    console.error('[Seed] Database not available');
    return;
  }

  try {
    console.log('[Seed] Starting database seeding...');

    // ==================== CATEGORIES ====================
    const categoryData: any[] = [
      {
        name: 'الملابس',
        description: 'ملابس نسائية ورجالية عصرية وأنيقة',
        image: '/images/categories/clothing.jpg',
        displayOrder: 1,
        isActive: true,
        showOnHomepage: true,
      },
      {
        name: 'الأثاث',
        description: 'أثاث منزلي فاخر وعملي',
        image: '/images/categories/furniture.jpg',
        displayOrder: 2,
        isActive: true,
        showOnHomepage: true,
      },
      {
        name: 'الإكسسوارات',
        description: 'إكسسوارات وحقائب وأحذية',
        image: '/images/categories/accessories.jpg',
        displayOrder: 3,
        isActive: true,
        showOnHomepage: true,
      },
    ];

    // Check if categories exist
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length === 0) {
      for (const cat of categoryData) {
        await db.insert(categories).values(cat);
      }
      console.log('[Seed] Categories created');
    }

    // ==================== WAREHOUSES ====================
    const warehouseData: any[] = [
      {
        name: 'مستودع عمّان الرئيسي',
        code: 'WH-AMM-01',
        location: 'عمّان، الأردن',
        isActive: true,
      },
      {
        name: 'مستودع الزرقاء',
        code: 'WH-ZRQ-01',
        location: 'الزرقاء، الأردن',
        isActive: true,
      },
      {
        name: 'مستودع إربد',
        code: 'WH-IRB-01',
        location: 'إربد، الأردن',
        isActive: true,
      },
    ];

    const existingWarehouses = await db.select().from(warehouses);
    if (existingWarehouses.length === 0) {
      for (const wh of warehouseData) {
        await db.insert(warehouses).values(wh);
      }
      console.log('[Seed] Warehouses created');
    }

    // ==================== PRODUCTS ====================
    const productData: any[] = [
      // Clothing
      {
        categoryId: 1,
        warehouseCode: 'WH-AMM-01',
        name: 'فستان سهرة أنيق',
        description: 'فستان سهرة فاخر بتصميم عصري وألوان جذابة',
        price: '150.00',
        originalPrice: '200.00',
        discount: '25.00',
        image: '/images/products/dress-1.jpg',
        images: JSON.stringify(['/images/products/dress-1.jpg', '/images/products/dress-2.jpg']),
        weight: '0.5kg',
        colors: JSON.stringify(['أحمر', 'أسود', 'ذهبي', 'فضي']),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        stock: 50,
        lowStockThreshold: 10,
        sku: 'DRESS-001',
        barcode: '1234567890123',
        isActive: true,
        isFeatured: true,
        averageRating: '4.50',
        totalReviews: 25,
      },
      {
        categoryId: 1,
        warehouseCode: 'WH-AMM-01',
        name: 'قميص رجالي كلاسيكي',
        description: 'قميص رجالي فاخر من القطن الخالص',
        price: '80.00',
        originalPrice: '100.00',
        discount: '20.00',
        image: '/images/products/shirt-1.jpg',
        images: JSON.stringify(['/images/products/shirt-1.jpg']),
        weight: '0.3kg',
        colors: JSON.stringify(['أبيض', 'أزرق', 'رمادي', 'أسود']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        stock: 100,
        lowStockThreshold: 20,
        sku: 'SHIRT-001',
        barcode: '1234567890124',
        isActive: true,
        isFeatured: true,
        averageRating: '4.30',
        totalReviews: 18,
      },
      // Furniture
      {
        categoryId: 2,
        warehouseCode: 'WH-ZRQ-01',
        name: 'كنبة جلدية فاخرة',
        description: 'كنبة جلدية إيطالية الصنع بتصميم حديث',
        price: '1200.00',
        originalPrice: '1500.00',
        discount: '20.00',
        image: '/images/products/sofa-1.jpg',
        images: JSON.stringify(['/images/products/sofa-1.jpg', '/images/products/sofa-2.jpg']),
        weight: '150kg',
        colors: JSON.stringify(['بني', 'أسود', 'رمادي']),
        sizes: JSON.stringify(['3-Seater', '4-Seater']),
        stock: 15,
        lowStockThreshold: 3,
        sku: 'SOFA-001',
        barcode: '1234567890125',
        isActive: true,
        isFeatured: true,
        averageRating: '4.80',
        totalReviews: 42,
      },
      {
        categoryId: 2,
        warehouseCode: 'WH-ZRQ-01',
        name: 'طاولة طعام خشبية',
        description: 'طاولة طعام من الخشب الطبيعي بتصميم أنيق',
        price: '600.00',
        originalPrice: '750.00',
        discount: '20.00',
        image: '/images/products/table-1.jpg',
        images: JSON.stringify(['/images/products/table-1.jpg']),
        weight: '80kg',
        colors: JSON.stringify(['بني فاتح', 'بني غامق', 'أسود']),
        sizes: JSON.stringify(['4-Person', '6-Person', '8-Person']),
        stock: 25,
        lowStockThreshold: 5,
        sku: 'TABLE-001',
        barcode: '1234567890126',
        isActive: true,
        isFeatured: false,
        averageRating: '4.60',
        totalReviews: 30,
      },
      // Accessories
      {
        categoryId: 3,
        warehouseCode: 'WH-IRB-01',
        name: 'حقيبة يد جلدية',
        description: 'حقيبة يد جلدية فاخرة بتصميم عصري',
        price: '250.00',
        originalPrice: '320.00',
        discount: '21.88',
        image: '/images/products/bag-1.jpg',
        images: JSON.stringify(['/images/products/bag-1.jpg', '/images/products/bag-2.jpg']),
        weight: '1.2kg',
        colors: JSON.stringify(['بني', 'أسود', 'أحمر', 'بيج']),
        sizes: JSON.stringify(['One Size']),
        stock: 60,
        lowStockThreshold: 15,
        sku: 'BAG-001',
        barcode: '1234567890127',
        isActive: true,
        isFeatured: true,
        averageRating: '4.70',
        totalReviews: 35,
      },
      {
        categoryId: 3,
        warehouseCode: 'WH-IRB-01',
        name: 'ساعة ذهبية فاخرة',
        description: 'ساعة يد ذهبية بآلية سويسرية دقيقة',
        price: '450.00',
        originalPrice: '600.00',
        discount: '25.00',
        image: '/images/products/watch-1.jpg',
        images: JSON.stringify(['/images/products/watch-1.jpg']),
        weight: '0.15kg',
        colors: JSON.stringify(['ذهبي', 'فضي']),
        sizes: JSON.stringify(['One Size']),
        stock: 30,
        lowStockThreshold: 5,
        sku: 'WATCH-001',
        barcode: '1234567890128',
        isActive: true,
        isFeatured: true,
        averageRating: '4.90',
        totalReviews: 50,
      },
    ];

    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      for (const prod of productData) {
        await db.insert(products).values(prod);
      }
      console.log('[Seed] Products created');
    }

    // ==================== DISCOUNT CODES ====================
    const discountData: any[] = [
      {
        code: 'WELCOME2024',
        description: 'كود ترحيب للعملاء الجدد',
        discountType: 'percentage' as const,
        discountValue: 15.00,
        minOrderAmount: 100.00,
        maxDiscount: 50.00,
        usageLimit: 1000,
        usagePerUser: 1,
        usageCount: 0,
        applicableCategories: JSON.stringify([1, 2, 3]),
        applicableProducts: undefined,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
      },
      {
        code: 'SUMMER50',
        description: 'خصم صيفي على الملابس',
        discountType: 'percentage' as const,
        discountValue: 50.00,
        minOrderAmount: 200.00,
        maxDiscount: undefined,
        usageLimit: 500,
        usagePerUser: 2,
        usageCount: 0,
        applicableCategories: JSON.stringify([1]),
        applicableProducts: undefined,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        isActive: true,
      },
      {
        code: 'FURNITURE100',
        description: 'خصم ثابت على الأثاث',
        discountType: 'fixed' as const,
        discountValue: 100.00,
        minOrderAmount: 500.00,
        maxDiscount: undefined,
        usageLimit: 300,
        usagePerUser: 1,
        usageCount: 0,
        applicableCategories: JSON.stringify([2]),
        applicableProducts: undefined,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
      },
    ];

    const existingDiscounts = await db.select().from(discountCodes);
    if (existingDiscounts.length === 0) {
      for (const disc of discountData) {
        await db.insert(discountCodes).values(disc);
      }
      console.log('[Seed] Discount codes created');
    }

    // ==================== GROUP CHAT ROOMS ====================
    const chatRoomData: any[] = [
      {
        name: 'الدعم الفني',
        description: 'غرفة الدعم الفني والمساعدة العامة',
        icon: '🛠️',
        createdBy: 1,
        isPublic: true,
        maxMembers: 1000,
        isActive: true,
      },
      {
        name: 'الأسئلة الشائعة',
        description: 'أسئلة شائعة حول المنتجات والخدمات',
        icon: '❓',
        createdBy: 1,
        isPublic: true,
        maxMembers: 1000,
        isActive: true,
      },
      {
        name: 'المقترحات والآراء',
        description: 'شارك مقترحاتك لتحسين الخدمة',
        icon: '💡',
        createdBy: 1,
        isPublic: true,
        maxMembers: 1000,
        isActive: true,
      },
      {
        name: 'التقييمات والشكاوى',
        description: 'شكاوى وتقييمات العملاء',
        icon: '⭐',
        createdBy: 1,
        isPublic: true,
        maxMembers: 1000,
        isActive: true,
      },
    ];

    const existingRooms = await db.select().from(groupChatRooms);
    if (existingRooms.length === 0) {
      for (const room of chatRoomData) {
        await db.insert(groupChatRooms).values(room);
      }
      console.log('[Seed] Group chat rooms created');
    }

    console.log('[Seed] Database seeding completed successfully!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
