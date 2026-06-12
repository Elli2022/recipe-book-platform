import { normalizeRecipe, type Recipe } from "@/lib/recipes";
import { EMBEDDED_RECIPE_IMAGE_BY_ID } from "@/lib/supabase/embedded-recipe-images";

const detailCache = new Map<string, Recipe>();
const inflightBasic = new Map<string, Promise<Recipe | null>>();

export function recipeNeedsMediaFetch(recipe: Recipe): boolean {
  if (recipe._id && EMBEDDED_RECIPE_IMAGE_BY_ID[recipe._id]) {
    return false;
  }
  const image = recipe.image?.trim() ?? "";
  return !image || image.startsWith("data:");
}

export function stashRecipeDetail(recipe: Recipe): void {
  detailCache.set(recipe._id, normalizeRecipe(recipe));
}

export function peekRecipeDetail(id: string): Recipe | undefined {
  return detailCache.get(id);
}

export async function fetchRecipeBasic(id: string): Promise<Recipe | null> {
  const cached = detailCache.get(id);
  if (cached) {
    return cached;
  }

  const pending = inflightBasic.get(id);
  if (pending) {
    return pending;
  }

  const promise = (async () => {
    const response = await fetch(`/api/recipes/${id}?fields=basic`, {
      credentials: "include",
    });
    if (!response.ok) {
      return null;
    }
    const recipe = normalizeRecipe(await response.json());
    detailCache.set(id, recipe);
    return recipe;
  })();

  inflightBasic.set(id, promise);
  try {
    return await promise;
  } finally {
    inflightBasic.delete(id);
  }
}
