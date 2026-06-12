import HomeClient from "./HomeClient";
import { enrichRecipe, normalizeRecipe } from "@/lib/recipes";
import { listRecipesForServer } from "@/lib/supabase/list-recipes-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const recipes = await listRecipesForServer();
  const normalized = recipes.map(normalizeRecipe).map(enrichRecipe);

  return <HomeClient recipes={normalized} totalCount={normalized.length} />;
}
