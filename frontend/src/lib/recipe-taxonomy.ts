import type { Recipe } from "@/lib/recipes";

export const MEAL_TYPES = [
  { id: "alla", label: "Alla måltider" },
  { id: "frukost", label: "Frukost" },
  { id: "lunch", label: "Lunch" },
  { id: "middag", label: "Middag" },
  { id: "mellanmal", label: "Mellanmål" },
  { id: "dessert", label: "Dessert" },
  { id: "bak", label: "Bak" },
] as const;

export type MealTypeId = (typeof MEAL_TYPES)[number]["id"];

export const SORT_OPTIONS = [
  { id: "newest", label: "Senast tillagda" },
  { id: "name", label: "A–Ö" },
  { id: "time", label: "Snabbast först" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export const DIET_TAGS = [
  { id: "vegetariskt", label: "Vegetariskt" },
  { id: "veganskt", label: "Veganskt" },
  { id: "glutenfritt", label: "Glutenfritt" },
  { id: "snabbt", label: "Snabbt (< 30 min)" },
] as const;

const MEAL_KEYWORDS: Record<Exclude<MealTypeId, "alla">, string[]> = {
  frukost: ["frukost", "morgon", "gröt", "pannkaka"],
  lunch: ["lunch", "sallad", "soppa"],
  middag: [
    "middag",
    "huvudrätt",
    "middags",
    "kyckling",
    "kött",
    "fisk",
    "pasta",
    "lasagne",
    "one pot",
  ],
  mellanmal: ["mellan", "tilltugg", "snacks"],
  dessert: ["dessert", "efterrätt", "kaka", "choklad"],
  bak: ["bak", "bröd", "bullar", "pizza", "bakverk"],
};

export function recipeMatchesCategory(recipe: Recipe, category: string) {
  if (!category || category === "Alla") {
    return true;
  }

  const selected = category.toLowerCase();
  const parts = (recipe.category ?? "Okategoriserat")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  return parts.includes(selected) || parts.some((part) => part.includes(selected));
}

export function recipeMatchesMeal(recipe: Recipe, mealFilter: MealTypeId) {
  if (mealFilter === "alla") {
    return true;
  }

  const inferred =
    recipe.mealType ?? inferMealType(recipe.category, recipe.name);
  if (inferred === mealFilter) {
    return true;
  }

  const keywords = MEAL_KEYWORDS[mealFilter];
  const haystack = `${recipe.category ?? ""} ${recipe.name ?? ""}`.toLowerCase();
  return keywords.some((word) => haystack.includes(word));
}

export function browseCategoriesFromRecipes(recipes: Recipe[]) {
  const categories = new Set<string>();

  for (const recipe of recipes) {
    const raw = recipe.category?.trim() || "Okategoriserat";
    for (const part of raw.split(",")) {
      const label = part.trim();
      if (label) {
        categories.add(label);
      }
    }
  }

  return ["Alla", ...Array.from(categories).sort((a, b) => a.localeCompare(b, "sv"))];
}

export function inferMealType(category?: string, name?: string): string | undefined {
  const haystack = `${category ?? ""} ${name ?? ""}`.toLowerCase();
  for (const [meal, words] of Object.entries(MEAL_KEYWORDS) as [
    Exclude<MealTypeId, "alla">,
    string[],
  ][]) {
    if (words.some((word) => haystack.includes(word))) {
      return meal;
    }
  }
  return undefined;
}

export function mealTypeLabel(id?: string | null) {
  return MEAL_TYPES.find((item) => item.id === id)?.label;
}

export function formatPrepTime(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}
