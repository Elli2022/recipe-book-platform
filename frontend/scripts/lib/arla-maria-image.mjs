import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Officiell bild-URL från Arla (används som fallback i listor). */
export const MARIA_ARLA_IMAGE_URL =
  "https://images.arla.com/recordid/F3051EC7-E4BC-4824-BAD357F7941DABBB/glutenfri-kladdkaka.jpg";

export const MARIA_ARLA_RECIPE_URL =
  "https://www.arla.se/recept/glutenfri-kladdkaka/";

export const MARIA_RECIPE_ID = "f3051ec7-e4bc-4824-bad3-57f7941dabb0";

const localPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/images/glutenfri-kladdkaka-maria.jpg"
);

/** Arlas JPEG inbäddat i recipes.image (data-URL) för Supabase. */
export function mariaImageForDatabase() {
  if (existsSync(localPath)) {
    const base64 = readFileSync(localPath).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  }

  return MARIA_ARLA_IMAGE_URL;
}

/** Lättviktig bildreferens för receptlistor (undviker MB base64 i list-API). */
export function mariaImageForList(storedImage) {
  if (!storedImage) {
    return MARIA_ARLA_IMAGE_URL;
  }
  if (storedImage.startsWith("data:")) {
    return MARIA_ARLA_IMAGE_URL;
  }
  return storedImage;
}
