import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { cuisines } from "@/lib/db/schema";

export async function listCuisines() {
  const db = getDb();
  if (!db) return [];

  return db.select().from(cuisines).orderBy(asc(cuisines.sortOrder));
}
