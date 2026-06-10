import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { recipeRowToClient, type RecipeRow } from "@/lib/supabase/recipes-map";

const MARIA_RECIPE_ID = "f3051ec7-e4bc-4824-bad3-57f7941dabb0";
const JASMINA_RECIPE_ID = "b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c";
const ELLIS_LASAGNE_RECIPE_ID = "9f555b7e-6322-44d7-ae67-5b04355f2481";
const MARIA_ARLA_IMAGE_URL =
  "https://images.arla.com/recordid/F3051EC7-E4BC-4824-BAD357F7941DABBB/glutenfri-kladdkaka.jpg";
const JASMINA_LIST_IMAGE_PATH = "/images/jasminas-halloumisallad.jpg";
const ELLIS_LASAGNE_LIST_IMAGE_PATH = "/images/ellis-vegetariska-lasagne.jpg";

const imageForList = (row: Partial<RecipeRow>) => {
  const image = row.image ?? "";
  if (!image) {
    return "";
  }
  if (image.startsWith("data:")) {
    if (row.id === MARIA_RECIPE_ID) {
      return MARIA_ARLA_IMAGE_URL;
    }
    if (row.id === JASMINA_RECIPE_ID) {
      return JASMINA_LIST_IMAGE_PATH;
    }
    if (row.id === ELLIS_LASAGNE_RECIPE_ID) {
      return ELLIS_LASAGNE_LIST_IMAGE_PATH;
    }
    return "";
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
