"use client";

import {
  DIET_TAGS,
  MEAL_TYPES,
  SORT_OPTIONS,
  type DietTagId,
  type MealTypeId,
  type SortId,
} from "@/lib/recipe-taxonomy";

type RecipeBrowseControlsProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  mealFilter: MealTypeId;
  onMealFilterChange: (value: MealTypeId) => void;
  dietFilter?: DietTagId | null;
  onDietFilterChange?: (value: DietTagId | null) => void;
  sortBy?: SortId;
  onSortChange?: (value: SortId) => void;
  searchId?: string;
  showSort?: boolean;
};

const chipClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    active
      ? "bg-rose-700 text-white shadow-sm"
      : "border border-stone-300 bg-white text-stone-700 hover:border-rose-300"
  }`;

const RecipeBrowseControls = ({
  searchTerm,
  onSearchChange,
  mealFilter,
  onMealFilterChange,
  dietFilter = null,
  onDietFilterChange,
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
            className={chipClass(mealFilter === meal.id)}
          >
            {meal.label}
          </button>
        ))}
      </section>

      {onDietFilterChange && (
        <section className="mt-2 flex flex-wrap gap-2">
          {DIET_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() =>
                onDietFilterChange(dietFilter === tag.id ? null : tag.id)
              }
              className={chipClass(dietFilter === tag.id)}
            >
              {tag.label}
            </button>
          ))}
        </section>
      )}
    </>
  );
};

export default RecipeBrowseControls;
