import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

async function resetPassword() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    
    // Hash the new password
    const newPassword = process.env.NEW_PASSWORD;
    if (!newPassword) {
      console.error("NEW_PASSWORD environment variable is required");
      process.exit(1);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    

    
    // Update password for Rose ONLIEN
    const [result] = await connection.execute(
      'UPDATE user SET password = ? WHERE email = ?',
      [hashedPassword, 'roseonlien0@gmail.com']
    );
    
    console.log('Update result:', result);
    
    if (result.affectedRows > 0) {
      console.log('✅ Password updated successfully!');
      console.log(`Email: roseonlien0@gmail.com`);
      console.log('Password updated successfully');
    } else {
      console.log('❌ No user found with that email');
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

resetPassword();
