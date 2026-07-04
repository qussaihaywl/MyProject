import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

async function seedWarehouses() {
  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    // Insert sample warehouses
    const warehouses = [
      {
        name: 'مستودع عمّان الرئيسي',
        code: 'WH-AMMAN-001',
        location: 'عمّان',
        isActive: true,
      },
      {
        name: 'مستودع الزرقاء',
        code: 'WH-ZARQA-001',
        location: 'الزرقاء',
        isActive: true,
      },
      {
        name: 'مستودع إربد',
        code: 'WH-IRBID-001',
        location: 'إربد',
        isActive: true,
      },
      {
        name: 'مستودع عجلون',
        code: 'WH-AJLOUN-001',
        location: 'عجلون',
        isActive: false,
      },
    ];

    for (const warehouse of warehouses) {
      await connection.execute(
        'INSERT INTO warehouses (name, code, location, isActive) VALUES (?, ?, ?, ?)',
        [warehouse.name, warehouse.code, warehouse.location, warehouse.isActive]
      );
      console.log(`✅ تم إضافة المستودع: ${warehouse.name}`);
    }

    console.log('\n✅ تم إضافة جميع المستودعات التجريبية بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في إضافة المستودعات:', error);
  } finally {
    await connection.end();
  }
}

seedWarehouses();
