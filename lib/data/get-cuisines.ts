import { createClient } from "@/lib/supabase/server";
import { listCuisines } from "@/lib/db/queries/cuisines";
import { FALLBACK_CUISINES } from "@/lib/data/fallback-cuisines";
import type { Cuisine } from "@/lib/types/database";

export async function getCuisines(): Promise<Cuisine[]> {
  try {
    const rows = await listCuisines();
    if (rows.length > 0) return rows;
  } catch {
    // Fall through to Supabase REST
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cuisines")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data?.length) {
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        imageUrl: row.image_url,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
      }));
    }
  } catch {
    // ignore
  }

  return FALLBACK_CUISINES;
}
