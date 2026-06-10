import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const JASMINA_RECIPE_ID = "b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c";

export const JASMINA_LIST_IMAGE_PATH = "/images/jasminas-halloumisallad.jpg";

const preparedPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/images/jasminas-halloumisallad.jpg"
);

/** Jasminas egna foto inbäddat i recipes.image (fungerar utan ny Netlify-deploy). */
export function jasminaImageForDatabase() {
  if (existsSync(preparedPath)) {
    const base64 = readFileSync(preparedPath).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  }

  return JASMINA_LIST_IMAGE_PATH;
}
