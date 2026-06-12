"use client";

import {
  MEAL_TYPES,
  SORT_OPTIONS,
  type MealTypeId,
  type SortId,
} from "@/lib/recipe-taxonomy";

type RecipeBrowseControlsProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  mealFilter: MealTypeId;
  onMealFilterChange: (value: MealTypeId) => void;
  sortBy?: SortId;
  onSortChange?: (value: SortId) => void;
  searchId?: string;
  showSort?: boolean;
};

const RecipeBrowseControls = ({
  searchTerm,
  onSearchChange,
  mealFilter,
  onMealFilterChange,
  sortBy = "newest",
  onSortChange,
  searchId = "recipe-search",
  showSort = false,
}: RecipeBrowseControlsProps) => {
  return (
    <>
      <div
        className={
          showSort
            ? "grid gap-3 sm:grid-cols-[1fr_auto]"
            : "flex flex-col gap-3 sm:flex-row"
        }
      >
        <label className="sr-only" htmlFor={searchId}>
          Sök recept
        </label>
        <input
          id={searchId}
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Sök recept, ingrediens eller kategori…"
          className="h-12 flex-1 rounded-full border border-stone-300 bg-stone-50 px-5 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
        />
        {showSort && onSortChange && (
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as SortId)}
            className="h-12 rounded-full border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800"
            aria-label="Sortering"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <section className="mt-4 flex flex-wrap gap-2">
        {MEAL_TYPES.map((meal) => (
          <button
            key={meal.id}
            type="button"
            onClick={() => onMealFilterChange(meal.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mealFilter === meal.id
                ? "bg-rose-700 text-white shadow-sm"
                : "border border-stone-300 bg-white text-stone-700 hover:border-rose-300"
            }`}
          >
            {meal.label}
          </button>
        ))}
      </section>
    </>
  );
};

export default RecipeBrowseControls;
