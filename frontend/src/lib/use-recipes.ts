"use client";

import { useCallback, useEffect, useState } from "react";
import type { Recipe } from "@/lib/recipes";
import {
  fetchRecipeList,
  peekRecipeList,
  stashRecipeList,
} from "@/lib/recipe-list-cache";

export function useRecipes() {
  const [recipes, setRecipesState] = useState<Recipe[]>(
    () => peekRecipeList() ?? []
  );
  const [isLoading, setIsLoading] = useState(() => peekRecipeList() === undefined);
  const [error, setError] = useState<string | null>(null);

  const setRecipes = useCallback(
    (updater: Recipe[] | ((current: Recipe[]) => Recipe[])) => {
      setRecipesState((current) => {
        const next =
          typeof updater === "function"
            ? (updater as (c: Recipe[]) => Recipe[])(current)
            : updater;
        stashRecipeList(next);
        return next;
      });
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const hadCache = peekRecipeList() !== undefined;
    void fetchRecipeList()
      .then((next) => {
        if (!cancelled) {
          setRecipesState(next);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled && !hadCache) {
          setError(e instanceof Error ? e.message : "Kunde inte hämta recept.");
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { recipes, isLoading, error, setRecipes };
}
