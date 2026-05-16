#!/usr/bin/env node
/**
 * Drops existing Chefie tables and reapplies supabase/migrations/001_initial_schema.sql
 *
 * Set ONE of these in .env (from Supabase Dashboard → Connect):
 *   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
 *   SUPABASE_DB_PASSWORD=your_database_password
 */
import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env") });

function projectRefFromUrl(url) {
  if (!url) return null;
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = projectRefFromUrl(supabaseUrl);
const password = process.env.SUPABASE_DB_PASSWORD;

if (!projectRef) {
  console.error("Could not parse project ref from NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const POOLER_REGIONS = [
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "us-east-1",
  "us-west-1",
  "eu-west-1",
  "eu-central-1",
];

function buildPoolerUrls(ref, pw) {
  const urls = [];
  for (const region of POOLER_REGIONS) {
    for (const port of [5432, 6543]) {
      urls.push(
        `postgresql://postgres.${ref}:${encodeURIComponent(pw)}@aws-0-${region}.pooler.supabase.com:${port}/postgres`
      );
    }
  }
  return urls;
}

async function connectClient() {
  if (process.env.DATABASE_URL) {
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    await client.connect();
    return client;
  }

  if (!password) {
    console.error(
      "Missing database credentials.\n\n" +
        "Add to .env (Supabase Dashboard → Connect → ORM / URI):\n" +
        "  DATABASE_URL=postgresql://postgres." +
        projectRef +
        ":[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres\n\n" +
        "Or:\n" +
        "  SUPABASE_DB_PASSWORD=[PASSWORD]\n"
    );
    process.exit(1);
  }

  const candidates = [
    `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
    ...buildPoolerUrls(projectRef, password),
  ];

  let lastError;
  for (const url of candidates) {
    const client = new pg.Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });
    try {
      await client.connect();
      await client.query("select 1");
      console.log("Connected via pooler/direct.");
      return client;
    } catch (err) {
      lastError = err;
      await client.end().catch(() => {});
    }
  }

  throw lastError ?? new Error("Could not connect to database");
}

const migrationsDir = join(__dirname, "..", "supabase", "migrations");
const migrationFiles = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const client = await connectClient();

try {
  console.log(`Applying migrations to project: ${projectRef}`);
  for (const file of migrationFiles) {
    console.log(`  → ${file}`);
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    await client.query(sql);
  }

  const tables = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in (
        'cuisines','recipes','ingredients','recipe_ingredients',
        'profiles','user_inventory','meal_plans','grocery_list'
      )
    order by table_name
  `);

  const { rows: counts } = await client.query(`
    select
      (select count(*)::int from public.cuisines) as cuisines,
      (select count(*)::int from public.recipes) as recipes,
      (select count(*)::int from public.ingredients) as ingredients
  `);

  console.log("Tables:", tables.rows.map((r) => r.table_name).join(", "));
  console.log(
    `Seed counts — cuisines: ${counts[0].cuisines}, recipes: ${counts[0].recipes}, ingredients: ${counts[0].ingredients}`
  );
  console.log("Done.");
} catch (err) {
  console.error(err.message ?? err);
  process.exit(1);
} finally {
  await client.end();
}
