"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import Footer from "./components/Footer";
import RecipeBrowseControls from "./components/RecipeBrowseControls";
import RecipeCard from "./components/RecipeCard";
import { Recipe, recipeMatchesSearch, sortRecipes } from "@/lib/recipes";
import {
  MEAL_TYPES,
  recipeMatchesMeal,
  type MealTypeId,
} from "@/lib/recipe-taxonomy";

type HomeClientProps = {
  recipes: Recipe[];
  totalCount: number;
};

const HomeClient = ({ recipes, totalCount }: HomeClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mealFilter, setMealFilter] = useState<MealTypeId>("alla");
  const deferredSearch = useDeferredValue(searchTerm);
  const hasActiveSearch = deferredSearch.trim().length > 0;
  const hasActiveBrowse = hasActiveSearch || mealFilter !== "alla";

  const filteredRecipes = useMemo(() => {
    const list = recipes.filter((recipe) => {
      if (!recipeMatchesSearch(recipe, deferredSearch)) {
        return false;
      }
      if (hasActiveSearch) {
        return true;
      }
      return recipeMatchesMeal(recipe, mealFilter);
    });
    return sortRecipes(list, "newest");
  }, [recipes, deferredSearch, hasActiveSearch, mealFilter]);

  const visibleRecipes = hasActiveBrowse
    ? filteredRecipes
    : filteredRecipes.slice(0, 6);

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setMealFilter("alla");
    }
  };

  const sectionTitle = hasActiveSearch
    ? `Sökresultat för “${deferredSearch.trim()}”`
    : mealFilter !== "alla"
      ? MEAL_TYPES.find((meal) => meal.id === mealFilter)?.label ?? "Filtrerat urval"
      : "Recept att laga nu";

  return (
    <div className="min-h-screen bg-stone-50">
      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-stone-900">
          <Image
            src="/images/heroImageLandingPage.jpg"
            alt="Hemlagad mat"
            fill
            priority
            className="object-cover opacity-70"
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">
              Receptbok
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Matinspiration för vardag och helg
            </h1>
            <p className="mt-4 max-w-xl text-lg text-stone-200">
              Sök bland dina recept, spara favoriter och laga med tydliga steg.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
              Hitta recept
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Bläddra i samlingen
            </h2>
            <p className="mt-3 max-w-2xl text-stone-600">
              Samma snabba sökning och filter som på receptsidan — utan att lämna
              startsidan.
            </p>

            <div className="mt-6">
              <RecipeBrowseControls
                searchId="home-recipe-search"
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                mealFilter={mealFilter}
                onMealFilterChange={setMealFilter}
              />
            </div>
          </header>

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-stone-950">{sectionTitle}</h3>
              <p className="mt-1 text-sm text-stone-500">
                {visibleRecipes.length}
                {hasActiveBrowse ? "" : ` av ${totalCount}`} recept
                {hasActiveSearch && " · söker i alla måltider"}
              </p>
            </div>
            <Link
              href={
                hasActiveSearch
                  ? `/recept?search=${encodeURIComponent(deferredSearch.trim())}`
                  : mealFilter !== "alla"
                    ? `/recept?meal=${mealFilter}`
                    : "/recept"
              }
              className="text-sm font-semibold text-rose-700 hover:underline"
            >
              Öppna i full vy
            </Link>
          </div>

          {visibleRecipes.length > 0 ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  href={`/recept/${recipe._id}`}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
              <p className="text-stone-600">
                Inga recept matchar ditt val. Prova en annan måltid eller sökning.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMealFilter("alla");
                  setSearchTerm("");
                }}
                className="mt-4 inline-flex rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Visa alla recept
              </button>
            </div>
          )}
        </section>

        <section className="border-t border-stone-200 bg-white py-14">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
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
