import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const JASMINA_RECIPE_ID = "b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c";

export const JASMINA_LIST_IMAGE_PATH = "/images/jasminas-halloumisallad.jpg";

const preparedPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/images/jasminas-halloumisallad.jpg"
);

/** Jasminas foto som lokal sökväg i recipes.image. */
export function jasminaImageForDatabase() {
  if (existsSync(preparedPath)) {
    return JASMINA_LIST_IMAGE_PATH;
  }

  return JASMINA_LIST_IMAGE_PATH;
}
