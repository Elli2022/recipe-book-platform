#!/usr/bin/env node
/**
 * Byter ut felaktig migrerad bild (Häxan-produkter) mot vegetarisk lasagne.
 * Kör: npm run update:ellis-lasagne-image
 */
import { createClient } from "@supabase/supabase-js";
import {
  ELLIS_LASAGNE_RECIPE_ID,
  ellisLasagneImageForDatabase,
} from "./lib/ellis-lasagne-image.mjs";

const required = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env: ${key}`);
    process.exit(1);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const image = ellisLasagneImageForDatabase();
if (!image.startsWith("data:")) {
  console.error(
    "Saknar bildfil: frontend/public/images/ellis-vegetariska-lasagne.jpg"
  );
  process.exit(1);
}

const { data, error } = await supabase
  .from("recipes")
  .update({
    image,
    source_image: "AI-genererad bild (vegetarisk lasagne)",
  })
  .eq("id", ELLIS_LASAGNE_RECIPE_ID)
  .select("id,name,image,source_image")
  .single();

if (error) {
  console.error("Update failed:", error.message);
  process.exit(1);
}

console.log(
  `Uppdaterade "${data.name}" (${data.id}) — bild ${data.image.length} tecken, source_image: ${data.source_image}`
);
