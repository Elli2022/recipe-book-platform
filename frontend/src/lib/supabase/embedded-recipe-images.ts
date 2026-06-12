const MARIA_RECIPE_ID = "f3051ec7-e4bc-4824-bad3-57f7941dabb0";
const JASMINA_RECIPE_ID = "b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c";
const ELLIS_LASAGNE_RECIPE_ID = "9f555b7e-6322-44d7-ae67-5b04355f2481";
const KOTTBULLAR_RECIPE_ID = "580be8ad-8d58-48b2-b8a6-29e69d58f6f4";
const GULLS_CHOKLADKAKA_RECIPE_ID = "5e4c5d19-27d7-48d1-a5c0-a8ce07c42c29";
const ELEONORA_SPAGHETTI_RECIPE_ID = "d4a52622-1871-449e-9b9a-d1c745fbb314";
const TAHINI_NOODLES_RECIPE_ID = "678fcfba-5d01-46c2-bcd1-bf489b806a82";
const SESAM_TAHINI_RECIPE_ID = "493557ad-4761-4bce-90fa-c46a0638f34e";
const MARIA_ARLA_IMAGE_URL =
  "https://images.arla.com/recordid/F3051EC7-E4BC-4824-BAD357F7941DABBB/glutenfri-kladdkaka.jpg";

/** Public paths / URLs for recipes stored as embedded data in Supabase. */
export const EMBEDDED_RECIPE_IMAGE_BY_ID: Record<string, string> = {
  [JASMINA_RECIPE_ID]: "/images/jasminas-halloumisallad.jpg",
  [ELLIS_LASAGNE_RECIPE_ID]: "/images/ellis-vegetariska-lasagne.jpg",
  [KOTTBULLAR_RECIPE_ID]: "/images/kottbullar-vegofars.jpg",
  [GULLS_CHOKLADKAKA_RECIPE_ID]: "/images/gulls-chokladkaka.jpg",
  [MARIA_RECIPE_ID]: MARIA_ARLA_IMAGE_URL,
  [ELEONORA_SPAGHETTI_RECIPE_ID]: "/images/pastaBurrataSparrisCitron.jpeg",
  [TAHINI_NOODLES_RECIPE_ID]: "/images/tahini-noodles.jpg",
  [SESAM_TAHINI_RECIPE_ID]: "/images/sesam-tahini-nudlar.jpg",
};

/** Resolve a recipe image for server responses (list + detail). */
export function resolveRecipeImageForServer(
  recipeId: string | undefined | null,
  rawImage: string | null | undefined
): string {
  if (recipeId && EMBEDDED_RECIPE_IMAGE_BY_ID[recipeId]) {
    return EMBEDDED_RECIPE_IMAGE_BY_ID[recipeId];
  }

  const image = rawImage ?? "";
  if (!image || image.startsWith("data:")) {
    return "";
  }
  return image;
}

export const resolveRecipeImage = resolveRecipeImageForServer;
