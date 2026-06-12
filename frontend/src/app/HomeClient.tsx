"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import Footer from "./components/Footer";
import RecipeBrowseControls from "./components/RecipeBrowseControls";
import RecipeCard from "./components/RecipeCard";
import { useLoggedIn } from "@/lib/auth/use-logged-in";
import { Recipe, recipeMatchesSearch, sortRecipes } from "@/lib/recipes";
import {
  recipeMatchesDiet,
  recipeMatchesMeal,
  type DietTagId,
  type MealTypeId,
  type SortId,
} from "@/lib/recipe-taxonomy";

type HomeClientProps = {
  recipes: Recipe[];
  totalCount: number;
};

const HomeClient = ({ recipes, totalCount }: HomeClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mealFilter, setMealFilter] = useState<MealTypeId>("alla");
  const [dietFilter, setDietFilter] = useState<DietTagId | null>(null);
  const [sortBy, setSortBy] = useState<SortId>("newest");
  const deferredSearch = useDeferredValue(searchTerm);
  const hasActiveSearch = deferredSearch.trim().length > 0;
  const isLoggedIn = useLoggedIn();

  const filteredRecipes = useMemo(() => {
    const list = recipes.filter((recipe) => {
      if (!recipeMatchesSearch(recipe, deferredSearch)) {
        return false;
      }
      if (hasActiveSearch) {
        return true;
      }
      if (!recipeMatchesMeal(recipe, mealFilter)) {
        return false;
      }
      return recipeMatchesDiet(recipe, dietFilter);
    });
    return sortRecipes(list, sortBy);
  }, [recipes, deferredSearch, hasActiveSearch, mealFilter, dietFilter, sortBy]);

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setMealFilter("alla");
      setDietFilter(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
            Hitta recept
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Matinspiration för vardag och helg
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-stone-600">
            Sök, filtrera och spara favoriter — inspirerat av recept.se, byggt för
            din egen bok.
          </p>

          <div className="mt-6 space-y-4">
            <RecipeBrowseControls
              searchId="home-recipe-search"
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              mealFilter={mealFilter}
              onMealFilterChange={setMealFilter}
              dietFilter={dietFilter}
              onDietFilterChange={setDietFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showSort
            />
            {isLoggedIn ? (
              <Link
                href="/recept#nytt-recept"
                className="inline-flex h-12 items-center justify-center rounded-full bg-rose-700 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-800"
              >
                + Nytt recept
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white hover:bg-stone-700"
              >
                Logga in
              </Link>
            )}
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-sm text-stone-500">{filteredRecipes.length} recept</p>
          {hasActiveSearch && (
            <p className="text-sm text-stone-500">
              Söker i alla recept (filter ignoreras)
            </p>
          )}
        </div>

        {filteredRecipes.length > 0 ? (
          <section className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                href={`/recept/${recipe._id}`}
              />
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-stone-950">Inga recept hittades</h2>
            <p className="mt-2 text-stone-600">
              {hasActiveSearch
                ? "Prova ett annat sökord eller rensa sökfältet för att filtrera på måltid igen."
                : "Prova en annan sökning eller filter."}
            </p>
            <button
              type="button"
              onClick={() => {
                setMealFilter("alla");
                setDietFilter(null);
                setSearchTerm("");
              }}
              className="mt-4 inline-flex rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Visa alla recept
            </button>
          </section>
        )}

        <section className="mt-14 border-t border-stone-200 pt-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-rose-700">{totalCount}</p>
              <p className="mt-1 text-stone-600">recept i samlingen</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-rose-700">♥</p>
              <p className="mt-1 text-stone-600">sparade favoriter när du är inloggad</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-rose-700">PWA</p>
              <p className="mt-1 text-stone-600">fungerar på mobilen</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomeClient;
