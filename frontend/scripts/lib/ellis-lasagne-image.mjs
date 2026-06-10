import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ELLIS_LASAGNE_RECIPE_ID = "9f555b7e-6322-44d7-ae67-5b04355f2481";

export const ELLIS_LASAGNE_LIST_IMAGE_PATH =
  "/images/ellis-vegetariska-lasagne.jpg";

const preparedPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/images/ellis-vegetariska-lasagne.jpg"
);

/** Ellis lasagne-bild som lokal sökväg i recipes.image. */
export function ellisLasagneImageForDatabase() {
  if (existsSync(preparedPath)) {
    return ELLIS_LASAGNE_LIST_IMAGE_PATH;
  }

  return ELLIS_LASAGNE_LIST_IMAGE_PATH;
}
