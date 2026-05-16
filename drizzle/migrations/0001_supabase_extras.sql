-- Supabase-specific: auth FKs, RLS, profile trigger (not managed by Drizzle schema)

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.user_inventory
  DROP CONSTRAINT IF EXISTS user_inventory_user_id_fkey;

ALTER TABLE public.meal_plans
  DROP CONSTRAINT IF EXISTS meal_plans_user_id_fkey;

ALTER TABLE public.grocery_list
  DROP CONSTRAINT IF EXISTS grocery_list_user_id_fkey;

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cuisines are viewable by everyone" ON public.cuisines;
CREATE POLICY "Cuisines are viewable by everyone"
  ON public.cuisines FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Ingredients are viewable by everyone" ON public.ingredients;
CREATE POLICY "Ingredients are viewable by everyone"
  ON public.ingredients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recipe ingredients are viewable by everyone" ON public.recipe_ingredients;
CREATE POLICY "Recipe ingredients are viewable by everyone"
  ON public.recipe_ingredients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users manage own inventory" ON public.user_inventory;
CREATE POLICY "Users manage own inventory"
  ON public.user_inventory FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own meal plans" ON public.meal_plans;
CREATE POLICY "Users manage own meal plans"
  ON public.meal_plans FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own grocery list" ON public.grocery_list;
CREATE POLICY "Users manage own grocery list"
  ON public.grocery_list FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
