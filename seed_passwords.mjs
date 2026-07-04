import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const pool = mysql.createPool({ uri: DATABASE_URL });
const db = drizzle(pool);

// Hash a password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Set passwords for all users
async function seedPasswords() {
  const defaultPassword = process.env.SEED_PASSWORD;
  if (!defaultPassword) {
    console.error("SEED_PASSWORD environment variable is required");
    process.exit(1);
  }

  try {
    const connection = await pool.getConnection();
    
    // Get all users
    const [users] = await connection.query("SELECT id, email FROM users");
    console.log(`Found ${users.length} users`);

    // Set password for each user
    for (const user of users) {
      const hashedPassword = await hashPassword(defaultPassword);
      await connection.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, user.id]
      );
      console.log(`Set password for ${user.email}`);
    }

    console.log("\nAll passwords set successfully!");
    
    connection.release();

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

seedPasswords();
