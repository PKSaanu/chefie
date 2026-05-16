import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

function getConnectionString(): string | null {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/
  )?.[1];
  const password = process.env.SUPABASE_DB_PASSWORD;

  if (ref && password) {
    return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
  }

  return null;
}

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

function getPool(): Pool | null {
  const connectionString = getConnectionString();
  if (!connectionString) return null;

  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
    });
  }

  return globalForDb.pool;
}

export function getDb() {
  const pool = getPool();
  if (!pool) return null;

  return drizzle(pool, { schema, casing: "snake_case" });
}

export type Db = NonNullable<ReturnType<typeof getDb>>;
