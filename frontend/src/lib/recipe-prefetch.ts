import { stashRecipeDetail } from "@/lib/recipe-detail-cache";
import { recipeImage, type Recipe } from "@/lib/recipes";

const preloadedImages = new Set<string>();
const hoverTimers = new Map<string, ReturnType<typeof setTimeout>>();

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

function runPrefetch(
  router: PrefetchableRouter | null | undefined,
  recipe: Recipe
) {
  stashRecipeDetail(recipe);
  router?.prefetch(`/recept/${recipe._id}`);
  preloadRecipeImageUrl(recipeImage(recipe));
}

/** Väntar kort vid hover — undvik API-storm när musen glider över rutnätet. */
export function prefetchRecipeDetailOnHover(
  router: PrefetchableRouter | null | undefined,
  recipe: Recipe
) {
  const id = recipe._id;
  const existing = hoverTimers.get(id);
  if (existing) {
    clearTimeout(existing);
  }

  hoverTimers.set(
    id,
    setTimeout(() => {
      hoverTimers.delete(id);
      runPrefetch(router, recipe);
    }, 150)
  );
}

/** Direkt vid klick — ingen extra API-fetch, listdata räcker för första paint. */
export function prefetchRecipeDetailOnClick(
  router: PrefetchableRouter | null | undefined,
  recipe: Recipe
) {
  const pending = hoverTimers.get(recipe._id);
  if (pending) {
    clearTimeout(pending);
    hoverTimers.delete(recipe._id);
  }
  runPrefetch(router, recipe);
}
