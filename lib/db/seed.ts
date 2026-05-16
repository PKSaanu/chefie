import dotenv from "dotenv";
import { eq, sql } from "drizzle-orm";
import { getDb } from "./index";
import {
  cuisines,
  ingredients,
  recipeIngredients,
  recipes,
} from "./schema";

dotenv.config();

async function seed() {
  const db = getDb();
  if (!db) {
    console.error("No database connection. Set DATABASE_URL in .env");
    process.exit(1);
  }

  console.log("Seeding database…");

  await db
    .insert(cuisines)
    .values([
      {
        name: "Sri Lankan",
        imageUrl:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop",
        sortOrder: 1,
      },
      {
        name: "Indian",
        imageUrl:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a7eb?w=600&h=600&fit=crop",
        sortOrder: 2,
      },
      {
        name: "Italian",
        imageUrl:
          "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop",
        sortOrder: 3,
      },
      {
        name: "Thai",
        imageUrl:
          "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=600&fit=crop",
        sortOrder: 4,
      },
      {
        name: "Mexican",
        imageUrl:
          "https://images.unsplash.com/photo-1565299585323-38bd6aeafc3e?w=600&h=600&fit=crop",
        sortOrder: 5,
      },
      {
        name: "Japanese",
        imageUrl:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop",
        sortOrder: 6,
      },
    ])
    .onConflictDoNothing({ target: cuisines.name });

  await db
    .insert(ingredients)
    .values(
      [
        "Rice",
        "Coconut milk",
        "Curry leaves",
        "Garlic",
        "Ginger",
        "Onion",
        "Tomato",
        "Chili powder",
        "Turmeric",
        "Cumin",
        "Paneer",
        "Green peas",
        "Cilantro",
        "Olive oil",
        "Pasta",
        "Basil",
        "Lime",
        "Fish sauce",
        "Soy sauce",
        "Tortilla",
      ].map((name) => ({ name }))
    )
    .onConflictDoNothing({ target: ingredients.name });

  const cuisineRows = await db.select().from(cuisines);
  const byName = Object.fromEntries(cuisineRows.map((c) => [c.name, c.id]));

  const existingRecipes = await db.select({ title: recipes.title }).from(recipes);
  const recipeTitles = new Set(existingRecipes.map((r) => r.title));

  if (!recipeTitles.has("Sri Lankan Chicken Curry")) {
    await db.insert(recipes).values([
      {
        title: "Sri Lankan Chicken Curry",
        description:
          "A fragrant coconut curry with warm spices — perfect for weeknight cooking.",
        imageUrl:
          "https://images.unsplash.com/photo-1604908176997-43183898608f?w=800&h=600&fit=crop",
        cuisineId: byName["Sri Lankan"],
        prepTime: 45,
        instructions: [
          "Heat oil in a pan and sauté chopped onion, garlic, and ginger until soft.",
          "Stir in chili powder, turmeric, and cumin for one minute.",
          "Add chicken pieces and brown on all sides.",
          "Pour in coconut milk, add curry leaves, and simmer for 25 minutes.",
          "Finish with salt to taste and fresh cilantro before serving.",
        ],
        voiceScript:
          "Welcome! We are making Sri Lankan chicken curry. Start by heating oil and softening your aromatics.",
      },
    ]);
  }

  if (!recipeTitles.has("Paneer Butter Masala")) {
    await db.insert(recipes).values([
      {
        title: "Paneer Butter Masala",
        description: "Creamy tomato curry with soft paneer cubes.",
        imageUrl:
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop",
        cuisineId: byName["Indian"],
        prepTime: 40,
        instructions: [
          "Blend tomatoes with cashews until smooth.",
          "Sauté onion and spices, then add the tomato mixture.",
          "Simmer until thick, stir in cream and paneer.",
          "Garnish with cilantro and serve hot with rice or naan.",
        ],
        voiceScript:
          "Let us cook paneer butter masala together. First, prepare your smooth tomato base.",
      },
    ]);
  }

  if (!recipeTitles.has("Classic Spaghetti Pomodoro")) {
    await db.insert(recipes).values([
      {
        title: "Classic Spaghetti Pomodoro",
        description: "Simple pasta with fresh tomato, garlic, and basil.",
        imageUrl:
          "https://images.unsplash.com/photo-1622976463538-9bf54a19bf6f?w=800&h=600&fit=crop",
        cuisineId: byName["Italian"],
        prepTime: 25,
        instructions: [
          "Cook spaghetti in salted boiling water until al dente.",
          "Gently cook garlic in olive oil without browning.",
          "Add crushed tomatoes and simmer for 10 minutes.",
          "Toss pasta with sauce and fresh basil before serving.",
        ],
        voiceScript:
          "Time for spaghetti pomodoro! Get your pasta water boiling first.",
      },
    ]);
  }

  const [curry] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.title, "Sri Lankan Chicken Curry"))
    .limit(1);

  if (curry) {
    const ingredientRows = await db.select().from(ingredients);
    const ingByName = Object.fromEntries(
      ingredientRows.map((i) => [i.name, i.id])
    );

    const links = [
      { name: "Coconut milk", amount: "400ml" },
      { name: "Curry leaves", amount: "1 sprig" },
      { name: "Garlic", amount: "4 cloves" },
      { name: "Ginger", amount: "2 inch piece" },
      { name: "Onion", amount: "1 large" },
      { name: "Chili powder", amount: "1 tbsp" },
      { name: "Turmeric", amount: "1 tsp" },
    ];

    await db
      .insert(recipeIngredients)
      .values(
        links.map((l) => ({
          recipeId: curry.id,
          ingredientId: ingByName[l.name],
          amount: l.amount,
        }))
      )
      .onConflictDoNothing();
  }

  const counts = await db.select({ count: sql<number>`count(*)::int` }).from(cuisines);
  console.log(`Done. ${counts[0]?.count ?? 0} cuisines in database.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
