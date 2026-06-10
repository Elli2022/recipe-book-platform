#!/usr/bin/env node
/**
 * Enhetlig bildstrategi: alla recept pekar på /images/... i public/.
 * Kör: npm run normalize:recipe-images
 */
import { createClient } from "@supabase/supabase-js";
import { ELLIS_LASAGNE_LIST_IMAGE_PATH } from "./lib/ellis-lasagne-image.mjs";
import { JASMINA_LIST_IMAGE_PATH } from "./lib/jasmina-image.mjs";

const MARIA_LIST_IMAGE_PATH = "/images/glutenfri-kladdkaka-maria.jpg";
const MARIA_ARLA_RECIPE_URL =
  "https://www.arla.se/recept/glutenfri-kladdkaka/";

const updates = [
  {
    id: "f3051ec7-e4bc-4824-bad3-57f7941dabb0",
    name: "Glutenfri kladdkaka med mandelmjöl (Marias)",
    image: MARIA_LIST_IMAGE_PATH,
    source_image: MARIA_ARLA_RECIPE_URL,
  },
  {
    id: "b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c",
    name: "Jasminas Halloumisallad",
    image: JASMINA_LIST_IMAGE_PATH,
  },
  {
    id: "9f555b7e-6322-44d7-ae67-5b04355f2481",
    name: "Ellis Vegetariska Lasagne",
    image: ELLIS_LASAGNE_LIST_IMAGE_PATH,
    owner_name: "Ellis",
    source_image: "AI-genererad bild (vegetarisk lasagne)",
  },
  {
    id: "678fcfba-5d01-46c2-bcd1-bf489b806a82",
    name: "Tahini Noodles",
    image: "/images/tahini-noodles.jpg",
    source_image: "AI-genererad bild (tahini noodles)",
  },
  {
    id: "493557ad-4761-4bce-90fa-c46a0638f34e",
    name: "Sesam Tahini Nudlar",
    image: "/images/sesam-tahini-nudlar.jpg",
    source_image: "AI-genererad bild (sesam tahini nudlar)",
  },
  {
    id: "580be8ad-8d58-48b2-b8a6-29e69d58f6f4",
    name: "Köttbullar med vegofärs",
    image: "/images/kottbullar-vegofars.jpg",
    source_image:
      "https://www.recept.se/recept/leif-mannerstroms-kottbullar/",
  },
  {
    id: "5e4c5d19-27d7-48d1-a5c0-a8ce07c42c29",
    name: "Gulls smaskiga Chokladkaka",
    image: "/images/gulls-chokladkaka.jpg",
    source_image:
      "https://commons.wikimedia.org/wiki/File:Kladdkaka-med-vispgradde.jpg",
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

for (const recipe of updates) {
  const { id, name, ...fields } = recipe;
  const { error } = await supabase.from("recipes").update(fields).eq("id", id);

  if (error) {
    console.error(`Misslyckades för ${name}:`, error.message);
    process.exit(1);
  }

  console.log(`Uppdaterade ${name} → ${fields.image}`);
}

console.log("Klart — alla bilder använder /images/... i public/.");
