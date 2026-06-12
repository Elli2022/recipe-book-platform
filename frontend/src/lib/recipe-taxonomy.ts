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
