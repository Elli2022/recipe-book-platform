"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";
import { Recipe, recipeMatchesSearch } from "@/lib/recipes";
import {
  browseCategoriesFromRecipes,
  recipeMatchesCategory,
} from "@/lib/recipe-taxonomy";

type HomeClientProps = {
  recipes: Recipe[];
  totalCount: number;
};

/** Landningssidan filtrerar recept direkt här — ingen omdirigering till tom /recept. */
const HomeClient = ({ recipes, totalCount }: HomeClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alla");

  const categories = useMemo(
    () => browseCategoriesFromRecipes(recipes),
    [recipes]
  );

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (!recipeMatchesSearch(recipe, searchTerm)) {
        return false;
      }
      return recipeMatchesCategory(recipe, selectedCategory);
    });
  }, [recipes, searchTerm, selectedCategory]);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    setSelectedCategory("Alla");
  };

  const sectionTitle =
    selectedCategory !== "Alla"
      ? selectedCategory
      : searchTerm.trim()
        ? `Sökresultat för “${searchTerm.trim()}”`
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
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-300">
              Receptbok
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Matinspiration för vardag och helg
            </h1>
            <p className="mt-4 max-w-xl text-lg text-stone-200">
              Sök bland dina recept, spara favoriter och laga med tydliga steg — i
              din egen samling.
            </p>

            <form
              onSubmit={onSearch}
              className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Sök ingrediens, rätt eller kategori…"
                className="h-14 flex-1 rounded-full border-0 bg-white/95 px-6 text-stone-950 shadow-lg outline-none focus:ring-4 focus:ring-rose-300/50"
              />
              <button
                type="submit"
                className="h-14 rounded-full bg-rose-600 px-8 text-sm font-semibold text-white shadow-lg hover:bg-rose-500"
              >
                Hitta recept
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition ${
                    selectedCategory === category
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
                {selectedCategory !== "Alla" || searchTerm.trim()
                  ? "Filtrerat urval"
                  : "Senast i boken"}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-stone-950">
                {sectionTitle}
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                {filteredRecipes.length} av {totalCount} recept
              </p>
            </div>
            <Link
              href="/recept"
              className="text-sm font-semibold text-rose-700 hover:underline"
            >
              Öppna hela samlingen
            </Link>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
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
                Inga recept matchar ditt val. Prova en annan kategori eller sökning.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("Alla");
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
