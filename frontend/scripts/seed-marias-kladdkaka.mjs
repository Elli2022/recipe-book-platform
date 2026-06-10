#!/usr/bin/env node
/**
 * Lägger in familjens favoritrecept i Supabase (idempotent).
 * Kör: npm run seed:marias-kladdkaka
 */
import { createClient } from "@supabase/supabase-js";
import {
  MARIA_ARLA_RECIPE_URL,
  MARIA_RECIPE_ID,
  mariaImageForDatabase,
} from "./lib/arla-maria-image.mjs";

const RECIPE_ID = MARIA_RECIPE_ID;

const recipe = {
  id: RECIPE_ID,
  owner_id: null,
  owner_name: "Maria Larsson",
  name: "Glutenfri kladdkaka med mandelmjöl (Marias)",
  description:
    "Familjens favorit. Maria Larsson tipsade om receptet — hon är partner till Robin Bergman och Jessicas kusin. Glutenfri kladdkaka med mandelmjöl, baserat på Arlas recept.",
  portions: "12",
  category: "Bakverk",
  ingredients: [
    "150 g smör",
    "3 ägg",
    "3 dl strösocker",
    "1½ dl mandelmjöl",
    "1 dl kakao",
    "½ msk vaniljsocker",
    "2 krm salt",
  ],
  instructions: [
    "Sätt ugnen på 175 °C (160 °C varmluft).",
    "Smörj en form med löstagbar kant, ca 24 cm i diameter, och bröa den med mandelmjöl.",
    "Smält smöret. Rör ihop ägg och socker. Blanda de torra ingredienserna och rör ner i smeten tillsammans med smöret.",
    "Häll smeten i formen. Grädda i mitten av ugnen ca 25 min tills ytan är torr men mitten fortfarande känns lite lös. Låt svalna.",
    "Servera med vispad grädde.",
  ],
  image: mariaImageForDatabase(),
  source_image: MARIA_ARLA_RECIPE_URL,
};

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

const { data: existing, error: readError } = await supabase
  .from("recipes")
  .select("id, name")
  .eq("id", RECIPE_ID)
  .maybeSingle();

if (readError) {
  console.error("Kunde inte läsa recept:", readError.message);
  process.exit(1);
}

if (existing) {
  const { error: updateError } = await supabase
    .from("recipes")
    .update(recipe)
    .eq("id", RECIPE_ID);

  if (updateError) {
    console.error("Kunde inte uppdatera recept:", updateError.message);
    process.exit(1);
  }

  console.log(`Uppdaterade: ${existing.name} (${RECIPE_ID})`);
  process.exit(0);
}

const { error: insertError } = await supabase.from("recipes").insert(recipe);

if (insertError) {
  console.error("Kunde inte skapa recept:", insertError.message);
  process.exit(1);
}

console.log(`Skapade: ${recipe.name} (${RECIPE_ID})`);
