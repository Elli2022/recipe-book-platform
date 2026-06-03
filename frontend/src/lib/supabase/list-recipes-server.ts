import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { recipeRowToClient, type RecipeRow } from "@/lib/supabase/recipes-map";

/** Server-only recipe list (SSR / API). Avoids self-fetch to /api on Netlify. */
export async function listRecipesForServer() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id,name,description,portions,category,ingredients,instructions,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listRecipesForServer:", error);
    return [];
  }

  const rows = ((data ?? []) as Partial<RecipeRow>[]).map((row) => ({
    ...row,
    image: "",
    source_image: "",
  })) as RecipeRow[];

  return rows.map(recipeRowToClient);
}
