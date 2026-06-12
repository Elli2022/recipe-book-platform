"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import RecipeImage from "@/app/components/RecipeImage";
import RecipeListSkeleton from "@/app/components/RecipeListSkeleton";
import {
  Recipe,
  mergeRecipes,
  recipeImage,
  saveLocalRecipeCopy,
} from "@/lib/recipes";
import { getStoredUser } from "@/lib/auth/local-user";
import { useLoggedIn } from "@/lib/auth/use-logged-in";
import {
  fetchFavoriteIds,
  peekFavoriteIds,
  removeFavoriteId,
} from "@/lib/favorites-cache";
import { useLocalRecipes } from "@/lib/use-local-recipes";
import { fetchRecipeList, peekRecipeList } from "@/lib/recipe-list-cache";

const SparadeClient = () => {
  const isLoggedIn = useLoggedIn();
  const cachedRecipes = peekRecipeList();
  const cachedFavorites = isLoggedIn ? peekFavoriteIds() : undefined;

  const [recipes, setRecipes] = useState<Recipe[]>(cachedRecipes ?? []);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(cachedRecipes === undefined);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(cachedFavorites ?? []);
  const [favoritesFetched, setFavoritesFetched] = useState(
    cachedFavorites !== undefined
  );
  const localRecipes = useLocalRecipes();

  useEffect(() => {
    let cancelled = false;
    void fetchRecipeList().then((list) => {
      if (!cancelled) {
        setRecipes(list);
        setIsLoadingRecipes(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || favoritesFetched) {
      return;
    }

    let cancelled = false;
    void fetchFavoriteIds().then((ids) => {
      if (!cancelled) {
        setFavoriteIds(ids);
        setFavoritesFetched(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, favoritesFetched]);

  const allRecipes = useMemo(
    () => mergeRecipes(localRecipes, recipes),
    [localRecipes, recipes]
  );

  const savedRecipes = useMemo(() => {
    const ids = isLoggedIn ? favoriteIds : [];
    return allRecipes.filter(
      (recipe) => ids.includes(recipe._id) || recipe.localOnly
    );
  }, [allRecipes, favoriteIds, isLoggedIn]);

  const showSkeleton =
    isLoggedIn &&
    savedRecipes.length === 0 &&
    (isLoadingRecipes || !favoritesFetched);

  const onToggleFavorite = (recipeId: string) => {
    if (!isLoggedIn) return;
    void (async () => {
      try {
        const response = await fetch(`/api/favorites/${recipeId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) return;
        removeFavoriteId(recipeId);
        setFavoriteIds((current) => current.filter((id) => id !== recipeId));
      } catch {
        // ignore
      }
    })();
  };

  const onCreateMyVersion = (recipe: Recipe) => {
    if (!isLoggedIn) return;
    saveLocalRecipeCopy(recipe, { ownerUserId: getStoredUser()?.id });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Sparade recept
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Dina favoriter och egna recept.
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-700">
            Här samlas recepten du har sparat och recepten du har lagt till på
            enheten.
          </p>
        </section>

        {showSkeleton ? (
          <RecipeListSkeleton count={3} />
        ) : !isLoggedIn ? (
          <section className="mt-8 rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-stone-950">Logga in för sparade recept</h2>
            <p className="mt-2 text-stone-600">
              Sparade favoriter ar kopplade till ditt konto i inloggat lage.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Logga in
            </Link>
          </section>
        ) : savedRecipes.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedRecipes.map((recipe) => (
              <article
                key={recipe._id}
                className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/recept/${recipe._id}`} className="block">
                  <RecipeImage src={recipeImage(recipe)} alt={recipe.name} />
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      <span>{recipe.category || "Okategoriserat"}</span>
                      {recipe.localOnly && <span>Lokalt</span>}
                    </div>
                    <h2 className="text-xl font-bold text-stone-950">{recipe.name}</h2>
                    {recipe.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(recipe._id)}
                    aria-label="Ta bort från sparade"
                    className="text-2xl leading-none text-rose-600 transition hover:text-rose-700"
                  >
                    ♥
                  </button>
                  <button
                    type="button"
                    onClick={() => onCreateMyVersion(recipe)}
                    className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
                  >
                    Egen version
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-stone-950">
              Du har inga sparade recept än
            </h2>
            <p className="mt-2 text-stone-600">
              Gå till receptsidan och spara dina favoriter.
            </p>
            <Link
              href="/recept"
              className="mt-5 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Visa recept
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SparadeClient;
