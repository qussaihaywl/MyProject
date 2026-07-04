import { db } from './server/db.ts';
import { users, products, orders, warehouses, categories } from './drizzle/schema.ts';

async function seedDatabase() {
  try {
    console.log('🌱 بدء إضافة البيانات التجريبية...');

    // Add users
    const newUsers = [
      { name: 'أحمد محمد', email: 'ahmed@example.com', role: 'user' },
      { name: 'فاطمة علي', email: 'fatima@example.com', role: 'user' },
      { name: 'محمود سالم', email: 'mahmoud@example.com', role: 'agent' },
      { name: 'ليلى حسن', email: 'layla@example.com', role: 'user' },
      { name: 'خالد عمر', email: 'khaled@example.com', role: 'agent' },
    ];

    // Add categories
    const newCategories = [
      { name: 'الملابس', description: 'ملابس نسائية ورجالية وأطفال' },
      { name: 'الأثاث', description: 'أثاث منزلي وديكور' },
      { name: 'الإكسسوارات', description: 'حقائب وأحذية وإكسسوارات' },
    ];

    // Add warehouses
    const newWarehouses = [
      { name: 'مستودع الرياض', code: 'WH001', city: 'الرياض' },
      { name: 'مستودع جدة', code: 'WH002', city: 'جدة' },
      { name: 'مستودع الدمام', code: 'WH003', city: 'الدمام' },
    ];

    // Add products
    const newProducts = [
      { name: 'فستان سهرة أحمر', description: 'فستان سهرة فاخر', price: 450, categoryId: 1 },
      { name: 'بنطال جينز أزرق', description: 'بنطال جينز عالي الجودة', price: 150, categoryId: 1 },
      { name: 'قميص أبيض رسمي', description: 'قميص رسمي مريح', price: 200, categoryId: 1 },
      { name: 'كنزة صوف دافئة', description: 'كنزة صوف شتوية', price: 180, categoryId: 1 },
      { name: 'حقيبة يد جلدية', description: 'حقيبة من الجلد الطبيعي', price: 350, categoryId: 3 },
      { name: 'أحذية رياضية', description: 'أحذية رياضية مريحة', price: 280, categoryId: 3 },
    ];

    // Add orders
    const newOrders = [
      { orderNumber: 'ORD001', totalPrice: 450, status: 'pending', paymentStatus: 'unpaid', customerName: 'أحمد محمد' },
      { orderNumber: 'ORD002', totalPrice: 150, status: 'processing', paymentStatus: 'partial', customerName: 'فاطمة علي' },
      { orderNumber: 'ORD003', totalPrice: 200, status: 'shipped', paymentStatus: 'paid', customerName: 'محمود سالم' },
      { orderNumber: 'ORD004', totalPrice: 180, status: 'delivered', paymentStatus: 'paid', customerName: 'ليلى حسن' },
      { orderNumber: 'ORD005', totalPrice: 350, status: 'pending', paymentStatus: 'unpaid', customerName: 'خالد عمر' },
      { orderNumber: 'ORD006', totalPrice: 280, status: 'processing', paymentStatus: 'partial', customerName: 'أحمد محمد' },
    ];

    console.log('✅ تم إضافة البيانات التجريبية بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

seedDatabase();
