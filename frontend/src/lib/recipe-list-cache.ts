import { enrichRecipe, normalizeRecipe, type Recipe } from "@/lib/recipes";

const CACHE_TTL_MS = 60_000;

let cachedRecipes: Recipe[] | null = null;
let cachedAt = 0;
let inflight: Promise<Recipe[]> | null = null;

export function peekRecipeList(): Recipe[] | undefined {
  if (cachedRecipes && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedRecipes;
  }
  return undefined;
}

export function stashRecipeList(recipes: Recipe[]): void {
  cachedRecipes = recipes.map(normalizeRecipe).map(enrichRecipe);
  cachedAt = Date.now();
}

export function prependRecipeToList(recipe: Recipe): void {
  const normalized = enrichRecipe(normalizeRecipe(recipe));
  const current = peekRecipeList() ?? [];
  stashRecipeList([
    normalized,
    ...current.filter((item) => item._id !== normalized._id),
  ]);
}

export function prefetchRecipeList(): void {
  void fetchRecipeList();
}

export async function fetchRecipeList(): Promise<Recipe[]> {
  const cached = peekRecipeList();
  if (cached) {
    return cached;
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    const response = await fetch("/api/recipes", { credentials: "include" });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const recipes = (Array.isArray(data) ? data : [])
      .map(normalizeRecipe)
      .map(enrichRecipe);
    stashRecipeList(recipes);
    return recipes;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
