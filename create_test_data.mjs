import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rose_online'
});

// Create a test room
await connection.execute(
  'INSERT INTO groupChatRooms (name, description, isPublic, isActive, createdBy, maxMembers) VALUES (?, ?, ?, ?, ?, ?)',
  ['الدردشة العامة', 'غرفة دردشة عامة لجميع المستخدمين', true, true, 1, 1000]
);

console.log('✅ تم إنشاء غرفة دردشة');

// Get first user
const [users] = await connection.execute('SELECT id FROM users LIMIT 1');
if (users.length > 0) {
  const userId = users[0].id;
  
  // Add user status
  try {
    await connection.execute(
      'INSERT INTO userStatus (userId, status, statusMessage) VALUES (?, ?, ?)',
      [userId, 'online', 'متصل الآن']
    );
  } catch (e) {
    // Update if exists
    await connection.execute(
      'UPDATE userStatus SET status = ?, statusMessage = ? WHERE userId = ?',
      ['online', 'متصل الآن', userId]
    );
  }
  
  console.log('✅ تم تحديث حالة المستخدم');
}

console.log('✅ تم إنشاء البيانات التجريبية');
await connection.end();
process.exit(0);
