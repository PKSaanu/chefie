import type { Cuisine } from "@/lib/types/database";

/** Used when the database is unreachable or not yet migrated. */
export const FALLBACK_CUISINES: Cuisine[] = [
  {
    id: 1,
    name: "Sri Lankan",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop",
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Indian",
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a7eb?w=600&h=600&fit=crop",
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Italian",
    imageUrl:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop",
    sortOrder: 3,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Thai",
    imageUrl:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=600&fit=crop",
    sortOrder: 4,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Mexican",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38bd6aeafc3e?w=600&h=600&fit=crop",
    sortOrder: 5,
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Japanese",
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop",
    sortOrder: 6,
    createdAt: new Date(),
  },
];
