"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";
import RecipeBrowseControls from "./components/RecipeBrowseControls";
import RecipeBrowsePageLayout from "./components/RecipeBrowsePageLayout";
import RecipeCard from "./components/RecipeCard";
import RecipeListSkeleton from "./components/RecipeListSkeleton";
import { useLoggedIn } from "@/lib/auth/use-logged-in";
import { prefetchRecipeDetail } from "@/lib/recipe-prefetch";
import { useRecipeBrowseFilters } from "@/lib/use-recipe-browse-filters";
import { useRecipes } from "@/lib/use-recipes";
import {
  DIET_TAGS,
  MEAL_TYPES,
} from "@/lib/recipe-taxonomy";

const HomeClient = () => {
  const router = useRouter();
  const { recipes, isLoading } = useRecipes();
  const isLoggedIn = useLoggedIn();

  const {
    searchTerm,
    deferredSearch,
    mealFilter,
    dietFilter,
    sortBy,
    hasActiveSearch,
    hasActiveBrowse,
    filteredRecipes,
    onSearchChange,
    setMealFilter,
    onDietFilterChange,
    setSortBy,
    resetFilters,
  } = useRecipeBrowseFilters(recipes);

  const visibleRecipes = hasActiveBrowse
    ? filteredRecipes
    : filteredRecipes.slice(0, 6);

  const sectionTitle = hasActiveSearch
    ? `Sökresultat för “${deferredSearch.trim()}”`
    : dietFilter
      ? DIET_TAGS.find((tag) => tag.id === dietFilter)?.label ?? "Filtrerat urval"
      : mealFilter !== "alla"
        ? MEAL_TYPES.find((meal) => meal.id === mealFilter)?.label ?? "Filtrerat urval"
        : "Recept att laga nu";

  return (
    <div className="min-h-screen bg-stone-50">
      <RecipeBrowsePageLayout
        title="Bläddra i samlingen"
        titleAs="h2"
        description="Samma snabba sökning och filter som på receptsidan — utan att lämna startsidan."
        controls={
          <RecipeBrowseControls
            searchId="home-recipe-search"
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            mealFilter={mealFilter}
            onMealFilterChange={setMealFilter}
            dietFilter={dietFilter}
            onDietFilterChange={onDietFilterChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showSort
          />
        }
        headerActions={
          isLoggedIn ? (
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
          )
        }
      >
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-stone-950">{sectionTitle}</h3>
            <p className="mt-1 text-sm text-stone-500">
              {isLoading ? "Laddar recept…" : visibleRecipes.length}
              {!isLoading && !hasActiveBrowse ? ` av ${recipes.length}` : ""} recept
              {hasActiveSearch && !isLoading && " · söker i alla recept (filter ignoreras)"}
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

        {isLoading ? (
          <RecipeListSkeleton count={6} />
        ) : visibleRecipes.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                href={`/recept/${recipe._id}`}
                onPrefetch={() => prefetchRecipeDetail(router, recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="text-stone-600">
              Inga recept matchar ditt val. Prova ett annat filter eller sökning.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex rounded-full bg-rose-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Visa alla recept
            </button>
          </div>
        )}
      </RecipeBrowsePageLayout>

      <section className="border-t border-stone-200 bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-rose-700">
              {isLoading ? "…" : recipes.length}
            </p>
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

      <Footer />
    </div>
  );
};

export default HomeClient;
