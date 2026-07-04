import { drizzle } from "drizzle-orm/mysql2/promise";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema });

const users = await db.query.users.findMany({
  limit: 15,
  columns: {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
  },
});

console.log("Users in database:");
console.table(users);

await connection.end();
