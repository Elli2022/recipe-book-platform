#!/usr/bin/env node
/**
 * Skriver om Eleonoras glutenfria spaghetti-recept i Supabase (idempotent).
 * Kör: npm run update:eleonora-spaghetti
 */
import { createClient } from "@supabase/supabase-js";

const RECIPE_ID = "d4a52622-1871-449e-9b9a-d1c745fbb314";

const recipe = {
  id: RECIPE_ID,
  owner_id: null,
  owner_name: "Eleonora Nocentini",
  name: "Glutenfri spaghetti med citron, smör, sparris och burrata",
  description:
    "Ljummen glutenfri spaghetti i smörig citronsås, serverad med lätt förvälld sparris, krämig burrata och rostade mandelflarn. Eleonora Nocentinis recept.",
  portions: "4",
  category: "huvudrätt, pasta",
  ingredients: [
    "360 g glutenfri spaghetti (torr vikt)",
    "400 g sparris",
    "2 burrata (à ca 125 g)",
    "100 g smör",
    "2 citroner",
    "50 g mandlar",
    "2 msk olivolja",
    "salt",
    "nymalen svartpeppar",
  ],
  instructions: [
    "Sätt ugnen på 175 °C. Lägg mandlarna på en plåt och rosta i ugnen ca 8–10 min tills de är gyllene och doftar. Låt svalna något och skiva eller flisa dem grovt till mandelflarn.",
    "Skölj sparrisen och bryt bort de träiga ändarna. Koka dem i lättsaltat vatten 2–3 minuter tills de är mjuka men fortfarande har lite tuggmotstånd. Häll av och håll sparrisen varm under lock.",
    "Koka pastan i rikligt med saltat vatten enligt förpackningens anvisning tills den är al dente. Spara ca 1 dl av pastavattnet innan du häller av.",
    "Riv zest från en citron och pressa saften från båda citronerna. Smält smöret i en stor stekpanna eller wok på medelvärme. Tillsätt citronsaften och hälften av zesten. Låt sjuda 1–2 minuter och smaka av med salt och peppar.",
    "Tillsätt den avrunna pastan till såsen tillsammans med en skvätt pastavatten. Vänd runt så att pastan täcks av den smöriga citronsåsen. Om såsen känns trög, tillsätt lite mer pastavatten.",
    "Lägg upp pastan på varma tallrikar. Toppa med sparris, en halverad burrata per portion, rostade mandelflarn och resten av citronzesten. Ringla ev. med lite olivolja och servera direkt.",
  ],
  image: "/images/pastaBurrataSparrisCitron.jpeg",
  source_image: "Eleonora Nocentinis recept",
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

  console.log(`Uppdaterade: ${existing.name} → ${recipe.name} (${RECIPE_ID})`);
  process.exit(0);
}

const { error: insertError } = await supabase.from("recipes").insert(recipe);

if (insertError) {
  console.error("Kunde inte skapa recept:", insertError.message);
  process.exit(1);
}

console.log(`Skapade: ${recipe.name} (${RECIPE_ID})`);
