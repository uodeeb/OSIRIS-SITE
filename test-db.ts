// Simple DB connection test
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("Testing database connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("No DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  query_timeout: 5000
});

pool.query("SELECT 1")
  .then(() => {
    console.log("✅ Database connection successful");
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    pool.end();
    process.exit(1);
  });

setTimeout(() => {
  console.error("❌ Connection timeout after 10s");
  pool.end();
  process.exit(1);
}, 10000);
