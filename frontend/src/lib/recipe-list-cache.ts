import { enrichRecipe, normalizeRecipe, type Recipe } from "@/lib/recipes";

const CACHE_TTL_MS = 5 * 60_000;
const STORAGE_KEY = "receptbok.recipes.v1";

let cachedRecipes: Recipe[] | null = null;
let cachedAt = 0;
let inflight: Promise<Recipe[]> | null = null;

function readSessionCache(): Recipe[] | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { recipes?: Recipe[]; at?: number };
    if (!parsed.recipes || !parsed.at || Date.now() - parsed.at > CACHE_TTL_MS) {
      return null;
    }
    return parsed.recipes.map(normalizeRecipe).map(enrichRecipe);
  } catch {
    return null;
  }
}

function writeSessionCache(recipes: Recipe[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ recipes, at: Date.now() })
    );
  } catch {
    // sessionStorage kan vara full eller blockerad
  }
}

export function peekRecipeList(): Recipe[] | undefined {
  if (cachedRecipes && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedRecipes;
  }

  const fromSession = readSessionCache();
  if (fromSession) {
    cachedRecipes = fromSession;
    cachedAt = Date.now();
    return fromSession;
  }

  return undefined;
}

export function stashRecipeList(recipes: Recipe[]): void {
  cachedRecipes = recipes.map(normalizeRecipe).map(enrichRecipe);
  cachedAt = Date.now();
  writeSessionCache(cachedRecipes);
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
