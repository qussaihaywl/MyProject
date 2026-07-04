import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://BQ974NdfamoyHhH.21342fb66f7a:M12wer0ovI6TGV4SIU7r@gateway06.us-east-1.prod.aws.tidbcloud.com:4000/PbM5MRSPLRoPndpAwMBnHr?ssl={"rejectUnauthorized":true}';

async function resetPassword() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    
    // Hash the new password
    const newPassword = 'Qussai@Rose';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('New hashed password:', hashedPassword);
    
    // Update password for Rose ONLIEN
    const [result] = await connection.execute(
      'UPDATE user SET password = ? WHERE email = ?',
      [hashedPassword, 'roseonlien0@gmail.com']
    );
    
    console.log('Update result:', result);
    
    if (result.affectedRows > 0) {
      console.log('✅ Password updated successfully!');
      console.log(`Email: roseonlien0@gmail.com`);
      console.log(`New Password: ${newPassword}`);
    } else {
      console.log('❌ No user found with that email');
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

resetPassword();
