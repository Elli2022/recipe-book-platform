import { useSyncExternalStore } from "react";
import { getLocalRecipes, type Recipe } from "@/lib/recipes";

export const LOCAL_RECIPES_CHANGE_EVENT = "receptbok:local-recipes-change";

const SERVER_LOCAL_RECIPES: Recipe[] = [];

let cachedSnapshot: Recipe[] = SERVER_LOCAL_RECIPES;

const readSnapshot = (): Recipe[] => {
  if (typeof window === "undefined") {
    return SERVER_LOCAL_RECIPES;
  }

  const next = getLocalRecipes();
  if (
    cachedSnapshot.length === next.length &&
    cachedSnapshot.every((recipe, index) => recipe._id === next[index]?._id)
  ) {
    return cachedSnapshot;
  }

  cachedSnapshot = next;
  return cachedSnapshot;
};

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onChange = () => {
    cachedSnapshot = SERVER_LOCAL_RECIPES;
    onStoreChange();
  };

  window.addEventListener(LOCAL_RECIPES_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(LOCAL_RECIPES_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** Client localStorage recipes; empty on server to avoid hydration mismatch. */
export function useLocalRecipes(): Recipe[] {
  return useSyncExternalStore(subscribe, readSnapshot, () => SERVER_LOCAL_RECIPES);
}
