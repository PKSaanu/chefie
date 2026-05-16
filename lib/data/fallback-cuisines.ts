import type { Cuisine } from "@/lib/types/database";

/** Used when Supabase is unreachable or migrations have not been applied yet. */
export const FALLBACK_CUISINES: Cuisine[] = [
  {
    id: 1,
    name: "Sri Lankan",
    image_url:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Indian",
    image_url:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a7eb?w=600&h=600&fit=crop",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Italian",
    image_url:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Thai",
    image_url:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=600&fit=crop",
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Mexican",
    image_url:
      "https://images.unsplash.com/photo-1565299585323-38bd6aeafc3e?w=600&h=600&fit=crop",
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Japanese",
    image_url:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop",
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];
