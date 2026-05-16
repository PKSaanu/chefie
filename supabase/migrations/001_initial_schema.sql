-- Chefie: reset + schema + seed (safe to re-run on a fresh or existing project)
-- Run: npm run db:setup  (needs DATABASE_URL or SUPABASE_DB_PASSWORD in .env)
-- Or paste into Supabase Dashboard → SQL Editor

-- ---------------------------------------------------------------------------
-- Reset: drop existing Chefie tables (order respects foreign keys)
-- ---------------------------------------------------------------------------

drop table if exists public.recipe_ingredients cascade;
drop table if exists public.user_inventory cascade;
drop table if exists public.meal_plans cascade;
drop table if exists public.grocery_list cascade;
drop table if exists public.recipes cascade;
drop table if exists public.profiles cascade;
drop table if exists public.ingredients cascade;
drop table if exists public.cuisines cascade;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.cuisines (
  id serial primary key,
  name text not null unique,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  cuisine_id int references public.cuisines (id) on delete set null,
  prep_time int,
  instructions jsonb not null default '[]'::jsonb,
  voice_script text,
  created_at timestamptz not null default now()
);

create table public.ingredients (
  id serial primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id int not null references public.ingredients (id) on delete cascade,
  amount text,
  unique (recipe_id, ingredient_id)
);

create table public.user_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ingredient_id int not null references public.ingredients (id) on delete cascade,
  quantity text,
  unique (user_id, ingredient_id)
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  planned_date date not null,
  created_at timestamptz not null default now()
);

create table public.grocery_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ingredient_id int not null references public.ingredients (id) on delete cascade,
  is_bought boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.cuisines enable row level security;
alter table public.recipes enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.user_inventory enable row level security;
alter table public.meal_plans enable row level security;
alter table public.grocery_list enable row level security;

create policy "Cuisines are viewable by everyone"
  on public.cuisines for select using (true);

create policy "Recipes are viewable by everyone"
  on public.recipes for select using (true);

create policy "Ingredients are viewable by everyone"
  on public.ingredients for select using (true);

create policy "Recipe ingredients are viewable by everyone"
  on public.recipe_ingredients for select using (true);

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users manage own inventory"
  on public.user_inventory for all using (auth.uid() = user_id);

create policy "Users manage own meal plans"
  on public.meal_plans for all using (auth.uid() = user_id);

create policy "Users manage own grocery list"
  on public.grocery_list for all using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed: cuisines
-- ---------------------------------------------------------------------------

insert into public.cuisines (name, image_url, sort_order) values
  ('Sri Lankan', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop', 1),
  ('Indian', 'https://images.unsplash.com/photo-1565557623262-b51c2513a7eb?w=600&h=600&fit=crop', 2),
  ('Italian', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop', 3),
  ('Thai', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=600&fit=crop', 4),
  ('Mexican', 'https://images.unsplash.com/photo-1565299585323-38bd6aeafc3e?w=600&h=600&fit=crop', 5),
  ('Japanese', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop', 6);

-- ---------------------------------------------------------------------------
-- Seed: ingredients
-- ---------------------------------------------------------------------------

insert into public.ingredients (name) values
  ('Rice'),
  ('Coconut milk'),
  ('Curry leaves'),
  ('Garlic'),
  ('Ginger'),
  ('Onion'),
  ('Tomato'),
  ('Chili powder'),
  ('Turmeric'),
  ('Cumin'),
  ('Paneer'),
  ('Green peas'),
  ('Cilantro'),
  ('Olive oil'),
  ('Pasta'),
  ('Basil'),
  ('Lime'),
  ('Fish sauce'),
  ('Soy sauce'),
  ('Tortilla');

-- ---------------------------------------------------------------------------
-- Seed: sample recipes
-- ---------------------------------------------------------------------------

insert into public.recipes (title, description, image_url, cuisine_id, prep_time, instructions, voice_script)
select
  'Sri Lankan Chicken Curry',
  'A fragrant coconut curry with warm spices — perfect for weeknight cooking.',
  'https://images.unsplash.com/photo-1604908176997-43183898608f?w=800&h=600&fit=crop',
  c.id,
  45,
  '[
    "Heat oil in a pan and sauté chopped onion, garlic, and ginger until soft.",
    "Stir in chili powder, turmeric, and cumin for one minute.",
    "Add chicken pieces and brown on all sides.",
    "Pour in coconut milk, add curry leaves, and simmer for 25 minutes.",
    "Finish with salt to taste and fresh cilantro before serving."
  ]'::jsonb,
  'Welcome! We are making Sri Lankan chicken curry. Start by heating oil and softening your aromatics.'
from public.cuisines c
where c.name = 'Sri Lankan';

insert into public.recipes (title, description, image_url, cuisine_id, prep_time, instructions, voice_script)
select
  'Paneer Butter Masala',
  'Creamy tomato curry with soft paneer cubes.',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
  c.id,
  40,
  '[
    "Blend tomatoes with cashews until smooth.",
    "Sauté onion and spices, then add the tomato mixture.",
    "Simmer until thick, stir in cream and paneer.",
    "Garnish with cilantro and serve hot with rice or naan."
  ]'::jsonb,
  'Let us cook paneer butter masala together. First, prepare your smooth tomato base.'
from public.cuisines c
where c.name = 'Indian';

insert into public.recipes (title, description, image_url, cuisine_id, prep_time, instructions, voice_script)
select
  'Classic Spaghetti Pomodoro',
  'Simple pasta with fresh tomato, garlic, and basil.',
  'https://images.unsplash.com/photo-1622976463538-9bf54a19bf6f?w=800&h=600&fit=crop',
  c.id,
  25,
  '[
    "Cook spaghetti in salted boiling water until al dente.",
    "Gently cook garlic in olive oil without browning.",
    "Add crushed tomatoes and simmer for 10 minutes.",
    "Toss pasta with sauce and fresh basil before serving."
  ]'::jsonb,
  'Time for spaghetti pomodoro! Get your pasta water boiling first.'
from public.cuisines c
where c.name = 'Italian';

insert into public.recipe_ingredients (recipe_id, ingredient_id, amount)
select r.id, i.id, v.amount
from public.recipes r
cross join (
  values
    ('Coconut milk', '400ml'),
    ('Curry leaves', '1 sprig'),
    ('Garlic', '4 cloves'),
    ('Ginger', '2 inch piece'),
    ('Onion', '1 large'),
    ('Chili powder', '1 tbsp'),
    ('Turmeric', '1 tsp')
) as v (ingredient_name, amount)
join public.ingredients i on i.name = v.ingredient_name
where r.title = 'Sri Lankan Chicken Curry';
