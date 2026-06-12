"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { recipeMatchesSearch, sortRecipes, type Recipe } from "@/lib/recipes";
import {
  mealFromQuery,
  recipeMatchesDiet,
  recipeMatchesMeal,
  type DietTagId,
  type MealTypeId,
  type SortId,
} from "@/lib/recipe-taxonomy";

type UseRecipeBrowseFiltersOptions = {
  initialSearch?: string;
  initialMeal?: MealTypeId;
};

export function useRecipeBrowseFilters(
  recipes: Recipe[],
  options: UseRecipeBrowseFiltersOptions = {}
) {
  const [searchTerm, setSearchTerm] = useState(options.initialSearch ?? "");
  const [mealFilter, setMealFilter] = useState<MealTypeId>(
    options.initialMeal ?? "alla"
  );
  const [dietFilter, setDietFilter] = useState<DietTagId | null>(null);
  const [sortBy, setSortBy] = useState<SortId>("newest");
  const deferredSearch = useDeferredValue(searchTerm);
  const hasActiveSearch = deferredSearch.trim().length > 0;
  const hasActiveBrowse =
    hasActiveSearch || mealFilter !== "alla" || dietFilter !== null;

  const filteredRecipes = useMemo(() => {
    const list = recipes.filter((recipe) => {
      if (!recipeMatchesSearch(recipe, deferredSearch)) return false;
      if (hasActiveSearch) return true;
      if (!recipeMatchesMeal(recipe, mealFilter)) return false;
      return recipeMatchesDiet(recipe, dietFilter);
    });
    return sortRecipes(list, sortBy);
  }, [recipes, deferredSearch, hasActiveSearch, mealFilter, dietFilter, sortBy]);

  const onSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setMealFilter("alla");
      setDietFilter(null);
    }
  }, []);

  const onDietFilterChange = useCallback((value: DietTagId | null) => {
    setDietFilter(value);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setMealFilter("alla");
    setDietFilter(null);
  }, []);

  const applyUrlFilters = useCallback(
    ({ search, meal }: { search: string | null; meal: string | null }) => {
      if (search) {
        setSearchTerm(search);
        setMealFilter("alla");
        setDietFilter(null);
        return;
      }
      setSearchTerm("");
      setMealFilter(mealFromQuery(meal));
    },
    []
  );

  return {
    searchTerm,
    deferredSearch,
    mealFilter,
    dietFilter,
    sortBy,
    hasActiveSearch,
    hasActiveBrowse,
    filteredRecipes,
    onSearchChange,
    setMealFilter,
    onDietFilterChange,
    setSortBy,
    resetFilters,
    applyUrlFilters,
  };
}
