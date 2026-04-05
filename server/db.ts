import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { assets, type Asset, type InsertAsset, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

// Optimized pool configuration for Supabase
function createPool(): Pool | null {
  if (!process.env.DATABASE_URL) {
    console.warn("[Database] DATABASE_URL not set");
    return null;
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum pool size
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Timeout for new connections
    // Enable SSL for production (Supabase requires it)
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : undefined,
  });
}

// Lazily create the drizzle instance with retry logic
export async function getDb(): Promise<ReturnType<typeof drizzle> | null> {
  if (_db) return _db;
  
  if (!process.env.DATABASE_URL) {
    if (ENV.isProduction) {
      console.warn("[Database] DATABASE_URL not set in production");
    }
    return null;
  }

  try {
    _pool = createPool();
    if (!_pool) return null;

    // Test connection
    const client = await _pool.connect();
    client.release();

    _db = drizzle(_pool);
    console.log("[Database] Connected successfully");
    return _db;
  } catch (error) {
    console.error("[Database] Connection failed:", error);
    _db = null;
    _pool = null;
    return null;
  }
}

// Graceful shutdown helper
export async function closeDb(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
    console.log("[Database] Pool closed");
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    if (ENV.isProduction) {
      console.warn("[Database] Cannot upsert user: database not available");
    }
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    // Note: PostgreSQL uses ON CONFLICT for upserts
    // For simplicity, we'll do insert and handle conflict
    await db.insert(users).values({
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      role: user.role ?? (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: users.openId,
      set: {
        name: user.name ?? null,
        email: user.email ?? null,
        loginMethod: user.loginMethod ?? null,
        role: user.role ?? (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    if (ENV.isProduction) {
      console.warn("[Database] Cannot get user: database not available");
    }
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listAssets(): Promise<Asset[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return db.select().from(assets);
}

export async function upsertAsset(assetRow: InsertAsset): Promise<void> {
  const db = await getDb();
  if (!db) {
    if (ENV.isProduction) {
      console.warn("[Database] Cannot upsert asset: database not available");
    }
    return;
  }
  // PostgreSQL uses onConflictDoUpdate instead of onDuplicateKeyUpdate
  await db.insert(assets).values({
    key: assetRow.key,
    kind: assetRow.kind,
    url: assetRow.url,
    mime: assetRow.mime ?? null,
    bytes: assetRow.bytes ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: assets.key,
    set: {
      kind: assetRow.kind,
      url: assetRow.url,
      mime: assetRow.mime ?? null,
      bytes: assetRow.bytes ?? null,
      updatedAt: new Date(),
    },
  });
}
