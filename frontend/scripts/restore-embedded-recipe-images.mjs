#!/usr/bin/env node
/**
 * Inbäddar receptbilder i Supabase så de fungerar utan ny Netlify-deploy.
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
import { embedPublicImage } from "./lib/recipe-image-embed.mjs";

const KOTTBULLAR_RECIPE_ID = "580be8ad-8d58-48b2-b8a6-29e69d58f6f4";
const GULLS_CHOKLADKAKA_RECIPE_ID = "5e4c5d19-27d7-48d1-a5c0-a8ce07c42c29";

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
  },
  {
    id: "f3051ec7-e4bc-4824-bad3-57f7941dabb0",
    name: "Glutenfri kladdkaka (Marias)",
    image: mariaImageForDatabase(),
  },
  {
    id: ELLIS_LASAGNE_RECIPE_ID,
    name: "Ellis Vegetariska Lasagne",
    image: ellisLasagneImageForDatabase(),
  },
  {
    id: KOTTBULLAR_RECIPE_ID,
    name: "Köttbullar med vegofärs",
    image: embedPublicImage("kottbullar-vegofars.jpg"),
  },
  {
    id: GULLS_CHOKLADKAKA_RECIPE_ID,
    name: "Gulls smaskiga Chokladkaka",
    image: embedPublicImage("gulls-chokladkaka.jpg"),
  },
];

for (const recipe of restores) {
  if (!recipe.image?.startsWith("data:")) {
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

  console.log(`Inbäddade ${recipe.name} — ${recipe.image.length} tecken`);
}

console.log("Klart — alla receptbilder finns i Supabase.");
