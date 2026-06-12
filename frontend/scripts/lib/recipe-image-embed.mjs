import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicImages = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/images"
);

/** Läs JPEG/PNG från public/images och returnera data-URL för Supabase. */
export function embedPublicImage(filename, mime = "image/jpeg") {
  const path = join(publicImages, filename);
  if (!existsSync(path)) {
    return null;
  }
  const base64 = readFileSync(path).toString("base64");
  return `data:${mime};base64,${base64}`;
}
