import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { recipeRowToClient, type RecipeRow } from "@/lib/supabase/recipes-map";

const MARIA_RECIPE_ID = "f3051ec7-e4bc-4824-bad3-57f7941dabb0";
const MARIA_ARLA_IMAGE_URL =
  "https://images.arla.com/recordid/F3051EC7-E4BC-4824-BAD357F7941DABBB/glutenfri-kladdkaka.jpg";

const imageForList = (row: Partial<RecipeRow>) => {
  const image = row.image ?? "";
  if (!image) {
    return "";
  }
  if (image.startsWith("data:")) {
    return row.id === MARIA_RECIPE_ID ? MARIA_ARLA_IMAGE_URL : "";
  }
  return image;
};

/** Server-only recipe list (SSR / API). Avoids self-fetch to /api on Netlify. */
export async function listRecipesForServer() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id,owner_name,name,description,portions,category,ingredients,instructions,image,source_image,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listRecipesForServer:", error);
    return [];
  }

  const rows = ((data ?? []) as Partial<RecipeRow>[]).map((row) => ({
    ...row,
    image: imageForList(row),
    source_image: row.source_image ?? "",
  })) as RecipeRow[];

  return rows.map(recipeRowToClient);
}
