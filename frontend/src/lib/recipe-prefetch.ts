import { stashRecipeDetail } from "@/lib/recipe-detail-cache";
import { recipeImage, type Recipe } from "@/lib/recipes";

const preloadedImages = new Set<string>();

export type PrefetchableRouter = {
  prefetch: (href: string) => void;
};

export function preloadRecipeImageUrl(url: string) {
  if (typeof window === "undefined" || !url) {
    return;
  }
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return;
  }
  if (preloadedImages.has(url)) {
    return;
  }
  preloadedImages.add(url);

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}

export function prefetchRecipeDetail(
  router: PrefetchableRouter | null | undefined,
  recipe: Recipe
) {
  stashRecipeDetail(recipe);
  router?.prefetch(`/recept/${recipe._id}`);
  preloadRecipeImageUrl(recipeImage(recipe));
}
