import { useSyncExternalStore } from "react";
import { getLocalRecipes, type Recipe } from "@/lib/recipes";

export const LOCAL_RECIPES_CHANGE_EVENT = "receptbok:local-recipes-change";

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onChange = () => onStoreChange();
  window.addEventListener(LOCAL_RECIPES_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(LOCAL_RECIPES_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** Client localStorage recipes; empty on server to avoid hydration mismatch. */
export function useLocalRecipes(): Recipe[] {
  return useSyncExternalStore(subscribe, getLocalRecipes, () => []);
}
