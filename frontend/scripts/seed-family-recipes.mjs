#!/usr/bin/env node
/**
 * Idempotent seed för familjefavoritrecept.
 * Kör: npm run seed:family-recipes
 */
import { createClient } from "@supabase/supabase-js";
import {
  MARIA_ARLA_RECIPE_URL,
  mariaImageForDatabase,
} from "./lib/arla-maria-image.mjs";
import { jasminaImageForDatabase } from "./lib/jasmina-image.mjs";

const recipes = [
  {
    id: "f3051ec7-e4bc-4824-bad3-57f7941dabb0",
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
  },
  {
    id: "b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c",
    owner_id: null,
    owner_name: "Jasmina",
    name: "Jasminas Halloumisallad",
    description:
      "Fräsch sallad med ugnsbakade småtomater, söt honungsmelon (vattenmelon funkar också) och pepprig ruccola. Grillad halloumi ger sältan och mustig smak.",
    portions: "4",
    category: "Sallad",
    ingredients: [
      "400 g halloumi",
      "500 g småtomater (gärna röda och gula)",
      "½ honungsmelon eller vattenmelon",
      "100 g ruccola",
      "2 msk olivolja",
      "1 msk honung",
      "flingsalt och svartpeppar",
      "ev. balsamicoglaze till servering",
    ],
    instructions: [
      "Sätt ugnen på 200 °C.",
      "Halvera småtomaterna, lägg på plåt med bakplåtspapper. Ringla över olivolja och honung, salta och peppra. Ugnsbaka ca 25–30 min tills tomaterna är mjuka och lätt karamelliserade.",
      "Skär halloumin i skivor och stek eller grilla i het panna tills den får fina grillränder och gyllene yta.",
      "Skär melonen i lagom stora bitar.",
      "Blanda ruccola, melon och tomater på ett fat. Toppa med halloumi och servera direkt.",
    ],
    image: jasminaImageForDatabase(),
    source_image: "Familjerecept",
  },
];

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

for (const recipe of recipes) {
  const { data: existing, error: readError } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("id", recipe.id)
    .maybeSingle();

  if (readError) {
    console.error(`Kunde inte läsa ${recipe.name}:`, readError.message);
    process.exit(1);
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("recipes")
      .update(recipe)
      .eq("id", recipe.id);

    if (updateError) {
      console.error(`Kunde inte uppdatera ${recipe.name}:`, updateError.message);
      process.exit(1);
    }

    console.log(`Uppdaterade: ${recipe.name} (${recipe.image})`);
    continue;
  }

  const { error: insertError } = await supabase.from("recipes").insert(recipe);

  if (insertError) {
    console.error(`Kunde inte skapa ${recipe.name}:`, insertError.message);
    process.exit(1);
  }

  console.log(`Skapade: ${recipe.name} (${recipe.image})`);
}

console.log("Klart — familjerecept finns i Supabase.");
