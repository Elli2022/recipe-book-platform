#!/usr/bin/env node
/**
 * Återställer inbäddade bilder för recept som måste fungera direkt
 * (egna foton / familjefavoriter) utan att vänta på Netlify-deploy.
 * Kör: npm run restore:embedded-images
 */
import { createClient } from "@supabase/supabase-js";
import { mariaImageForDatabase } from "./lib/arla-maria-image.mjs";
import {
  ELLIS_LASAGNE_RECIPE_ID,
  ellisLasagneImageForDatabase,
} from "./lib/ellis-lasagne-image.mjs";
import {
  JASMINA_RECIPE_ID,
  jasminaImageForDatabase,
} from "./lib/jasmina-image.mjs";

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

const restores = [
  {
    id: JASMINA_RECIPE_ID,
    name: "Jasminas Halloumisallad",
    image: jasminaImageForDatabase(),
    note: "egna fotot",
  },
  {
    id: "f3051ec7-e4bc-4824-bad3-57f7941dabb0",
    name: "Glutenfri kladdkaka (Marias)",
    image: mariaImageForDatabase(),
    note: "Arla-bild",
  },
  {
    id: ELLIS_LASAGNE_RECIPE_ID,
    name: "Ellis Vegetariska Lasagne",
    image: ellisLasagneImageForDatabase(),
    note: "lasagne",
  },
];

for (const recipe of restores) {
  if (!recipe.image.startsWith("data:")) {
    console.error(`Saknar bildfil för ${recipe.name}`);
    process.exit(1);
  }

  const { error } = await supabase
    .from("recipes")
    .update({ image: recipe.image })
    .eq("id", recipe.id);

  if (error) {
    console.error(`Misslyckades för ${recipe.name}:`, error.message);
    process.exit(1);
  }

  console.log(
    `Återställde ${recipe.name} (${recipe.note}) — ${recipe.image.length} tecken`
  );
}

console.log("Klart — egna/familjebilder är inbäddade i Supabase igen.");
