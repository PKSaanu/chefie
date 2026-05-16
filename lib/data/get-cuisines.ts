import { createClient } from "@/lib/supabase/server";
import { FALLBACK_CUISINES } from "@/lib/data/fallback-cuisines";
import type { Cuisine } from "@/lib/types/database";

export async function getCuisines(): Promise<Cuisine[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cuisines")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return FALLBACK_CUISINES;
    }

    return data;
  } catch {
    return FALLBACK_CUISINES;
  }
}
