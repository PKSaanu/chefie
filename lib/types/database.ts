import type { cuisines } from "@/lib/db/schema";

export type Cuisine = typeof cuisines.$inferSelect;
