import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import RecipeBrowseControls from "@/app/components/RecipeBrowseControls";
import RecipeCard from "@/app/components/RecipeCard";
import RecipeImage from "@/app/components/RecipeImage";
import {
  Recipe,
  RecipeDraft,
  enrichRecipe,
  mergeRecipes,
  normalizeRecipe,
  recipeMatchesSearch,
  saveLocalRecipe,
  saveLocalRecipeCopy,
  sortRecipes,
} from "@/lib/recipes";
import { getStoredUser } from "@/lib/auth/local-user";
import { useLoggedIn } from "@/lib/auth/use-logged-in";
import { useLocalRecipes } from "@/lib/use-local-recipes";
import { listRecipesForServer } from "@/lib/supabase/list-recipes-server";
import {
  DIET_TAGS,
  MEAL_TYPES,
  SORT_OPTIONS,
  recipeMatchesMeal,
  type MealTypeId,
  type SortId,
} from "@/lib/recipe-taxonomy";

type Props = {
  recipes: Recipe[];
  initialSearch: string;
  initialMeal: MealTypeId;
};

function mealFromQuery(value: string | string[] | undefined): MealTypeId {
  if (typeof value === "string" && MEAL_TYPES.some((meal) => meal.id === value)) {
    return value as MealTypeId;
  }
  return "alla";
}

const emptyDraft: RecipeDraft = {
  name: "",
  category: "",
  portions: "4",
  description: "",
  ingredients: "",
  instructions: "",
  imageUrl: "",
  imageDataUrl: "",
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const initialSearch =
    typeof context.query.search === "string" ? context.query.search : "";
  const initialMeal = initialSearch.trim()
    ? "alla"
    : mealFromQuery(context.query.meal);

  try {
    const recipes = await listRecipesForServer();
    return {
      props: {
        recipes: recipes.map(normalizeRecipe).map(enrichRecipe),
        initialSearch,
        initialMeal,
      },
    };
  } catch {
    return {
      props: {
        recipes: [],
        initialSearch,
        initialMeal,
      },
    };
  }
};

const ReceptPage = ({ recipes, initialSearch, initialMeal }: Props) => {
  const router = useRouter();
  const [remoteRecipes, setRemoteRecipes] = useState<Recipe[]>(recipes);
  const localRecipes = useLocalRecipes();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [mealFilter, setMealFilter] = useState<MealTypeId>(initialMeal);
  const [dietFilter, setDietFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortId>("newest");
  const [draft, setDraft] = useState<RecipeDraft>(emptyDraft);
  const [formStatus, setFormStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isLoggedIn = useLoggedIn();
  const [heartLoadingId, setHeartLoadingId] = useState<string | null>(null);

  const prefetchRecipeDetail = (recipeId: string) => {
    router.prefetch(`/recept/${recipeId}`);
    void fetch(`/api/recipes/${recipeId}?fields=basic`, {
      credentials: "include",
    });
  };

  useEffect(() => {
    const syncFromUrl = (url: string) => {
      const query = url.split("?")[1] ?? "";
      const params = new URLSearchParams(query);
      const q = params.get("search");
      const meal = params.get("meal");

      if (q) {
        setSearchTerm(q);
        setMealFilter("alla");
        setDietFilter(null);
        return;
      }

      setSearchTerm("");
      setMealFilter(mealFromQuery(meal ?? undefined));
    };

    const onRouteChange = (url: string) => syncFromUrl(url);
    router.events.on("routeChangeComplete", onRouteChange);
    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        const response = await fetch("/api/favorites", { credentials: "include" });
        if (!response.ok) return;
        const data = await response.json();
        setFavoriteIds(Array.isArray(data.recipeIds) ? data.recipeIds : []);
      } catch {
        // lazy load ok
      }
    })();
  }, [isLoggedIn]);

  const allRecipes = useMemo(
    () => mergeRecipes(localRecipes, remoteRecipes).map(enrichRecipe),
    [localRecipes, remoteRecipes]
  );

  const hasActiveSearch = searchTerm.trim().length > 0;

  const filteredRecipes = useMemo(() => {
    const list = allRecipes.filter((recipe) => {
      if (!recipeMatchesSearch(recipe, searchTerm)) return false;
      if (hasActiveSearch) return true;
      if (!recipeMatchesMeal(recipe, mealFilter)) return false;
      if (dietFilter) {
        const tags = (recipe.tags ?? []).map((t) => t.toLowerCase());
        const cat = (recipe.category ?? "").toLowerCase();
        const name = recipe.name.toLowerCase();
        if (dietFilter === "vegetariskt") {
          if (
            !tags.includes("vegetariskt") &&
            !cat.includes("vegetar") &&
            !name.includes("vegetar")
          ) {
            return false;
          }
        } else if (dietFilter === "veganskt") {
          if (!tags.includes("veganskt") && !cat.includes("vegan")) return false;
        } else if (dietFilter === "glutenfritt") {
          if (!tags.includes("glutenfritt") && !cat.includes("gluten")) {
            return false;
          }
        } else if (dietFilter === "snabbt") {
          if ((recipe.prepTimeMinutes ?? 999) > 30) return false;
        }
      }
      return true;
    });
    return sortRecipes(list, sortBy);
  }, [allRecipes, searchTerm, hasActiveSearch, mealFilter, dietFilter, sortBy]);

  const onDraftChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setDraft((current) => ({ ...current, imageDataUrl: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        imageDataUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const resetDraft = () => setDraft(emptyDraft);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("");
    setIsSaving(true);

    const recipePayload = normalizeRecipe({
      ...draft,
      ingredients: draft.ingredients,
      instructions: draft.instructions,
      image: draft.imageDataUrl || draft.imageUrl,
      source_image: draft.imageDataUrl ? "Egen bild" : draft.imageUrl,
    });

    if (!recipePayload.name.trim() || recipePayload.ingredients.length === 0) {
      setFormStatus("Fyll i namn och minst en ingrediens.");
      setIsSaving(false);
      return;
    }

    try {
      if (!isLoggedIn) {
        setFormStatus("Logga in för att skapa recept i ditt konto.");
        setIsSaving(false);
        return;
      }

      if (!draft.imageDataUrl) {
        const response = await fetch("/api/recipes", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipePayload),
        });

        if (response.ok) {
          const savedRecipe = normalizeRecipe(await response.json());
          setRemoteRecipes((current) => [enrichRecipe(savedRecipe), ...current]);
          setFormStatus("Receptet sparades.");
          resetDraft();
          return;
        }
      }

      saveLocalRecipe(draft);
      setFormStatus("Receptet sparades på den här enheten.");
      resetDraft();
    } catch {
      saveLocalRecipe(draft);
      setFormStatus("Receptet sparades på den här enheten.");
      resetDraft();
    } finally {
      setIsSaving(false);
    }
  };

  const onToggleFavorite = (recipeId: string) => {
    if (!isLoggedIn) {
      setFormStatus("Logga in för att spara favoriter.");
      return;
    }
    const isAlreadyFavorite = favoriteIds.includes(recipeId);
    setHeartLoadingId(recipeId);

    (async () => {
      try {
        if (isAlreadyFavorite) {
          const response = await fetch(`/api/favorites/${recipeId}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!response.ok) throw new Error();
          setFavoriteIds((c) => c.filter((id) => id !== recipeId));
        } else {
          const response = await fetch("/api/favorites", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId }),
          });
          if (!response.ok) throw new Error();
          setFavoriteIds((c) =>
            c.includes(recipeId) ? c : [recipeId, ...c]
          );
        }
      } catch {
        setFormStatus("Kunde inte uppdatera favorit.");
      } finally {
        setHeartLoadingId(null);
      }
    })();
  };

  const onCreateMyVersion = (recipe: Recipe) => {
    if (!isLoggedIn) {
      setFormStatus("Logga in för att skapa en egen version.");
      return;
    }
    const localCopy = saveLocalRecipeCopy(recipe, {
      ownerUserId: getStoredUser()?.id,
    });
    window.location.href = `/recept/${localCopy._id}`;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
            Hitta recept
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Din receptsamling
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-stone-600">
            Sök, filtrera och spara favoriter — inspirerat av recept.se, byggt för
            din egen bok.
          </p>

          <div className="mt-6 space-y-4">
            <RecipeBrowseControls
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                if (value.trim()) {
                  setMealFilter("alla");
                  setDietFilter(null);
                }
              }}
              mealFilter={mealFilter}
              onMealFilterChange={setMealFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showSort
            />
            {isLoggedIn ? (
              <Link
                href="#nytt-recept"
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

        <section className="mt-3 flex flex-wrap gap-2">
          {DIET_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() =>
                setDietFilter((current) => (current === tag.id ? null : tag.id))
              }
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                dietFilter === tag.id
                  ? "border-rose-700 bg-rose-50 text-rose-800"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </section>

        {formStatus && (
          <p className="mt-4 text-sm font-medium text-stone-700">{formStatus}</p>
        )}

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-sm text-stone-500">{filteredRecipes.length} recept</p>
          {hasActiveSearch && (
            <p className="text-sm text-stone-500">
              Söker i alla recept (filter ignoreras)
            </p>
          )}
        </div>

        <section className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              href={`/recept/${recipe._id}`}
              onPrefetch={() => prefetchRecipeDetail(recipe._id)}
              footer={
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(recipe._id)}
                    disabled={heartLoadingId === recipe._id}
                    aria-label={
                      favoriteIds.includes(recipe._id)
                        ? "Ta bort favorit"
                        : "Spara favorit"
                    }
                    className={`text-2xl transition disabled:opacity-50 ${
                      favoriteIds.includes(recipe._id)
                        ? "text-rose-600"
                        : "text-stone-400 hover:text-rose-500"
                    }`}
                  >
                    {favoriteIds.includes(recipe._id) ? "♥" : "♡"}
                  </button>
                  {favoriteIds.includes(recipe._id) && (
                    <button
                      type="button"
                      onClick={() => onCreateMyVersion(recipe)}
                      className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-rose-700 hover:text-rose-800"
                    >
                      Egen version
                    </button>
                  )}
                  {recipe.localOnly && (
                    <span className="text-xs font-medium text-amber-700">Lokalt</span>
                  )}
                </div>
              }
            />
          ))}
        </section>

        {filteredRecipes.length === 0 && (
          <section className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-stone-950">Inga recept hittades</h2>
            <p className="mt-2 text-stone-600">
              {hasActiveSearch
                ? "Prova ett annat sökord eller rensa sökfältet för att filtrera på måltid igen."
                : "Prova en annan sökning eller lägg till ett nytt recept."}
            </p>
          </section>
        )}

        <section
          id="nytt-recept"
          className="mt-14 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
              Nytt recept
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-950">
              Lägg till ett recept
            </h2>
          </div>

          {!isLoggedIn && (
            <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Du behöver vara inloggad för att skapa recept i Supabase.
              <Link href="/login" className="ml-2 font-semibold underline">
                Logga in
              </Link>
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Namn
                <input
                  name="name"
                  value={draft.name}
                  onChange={onDraftChange}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  required
                  disabled={!isLoggedIn}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Kategori
                <input
                  name="category"
                  value={draft.category}
                  onChange={onDraftChange}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  placeholder="Pasta, middag, dessert"
                  disabled={!isLoggedIn}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-[160px_1fr]">
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Portioner
                <input
                  name="portions"
                  type="number"
                  min="1"
                  value={draft.portions}
                  onChange={onDraftChange}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  disabled={!isLoggedIn}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Kort beskrivning
                <input
                  name="description"
                  value={draft.description}
                  onChange={onDraftChange}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  disabled={!isLoggedIn}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Ingredienser
                <textarea
                  name="ingredients"
                  value={draft.ingredients}
                  onChange={onDraftChange}
                  rows={7}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  placeholder={"400 g pasta\n2 dl grädde\n1 citron"}
                  required
                  disabled={!isLoggedIn}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Steg
                <textarea
                  name="instructions"
                  value={draft.instructions}
                  onChange={onDraftChange}
                  rows={7}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  placeholder={"Koka pastan.\nRör ihop såsen.\nServera direkt."}
                  disabled={!isLoggedIn}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Bildlänk
                <input
                  name="imageUrl"
                  type="url"
                  value={draft.imageUrl}
                  onChange={onDraftChange}
                  className="rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
                  placeholder="https://..."
                  disabled={!isLoggedIn}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-stone-700">
                Bild från mobilen
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-stone-950 file:mr-4 file:rounded-full file:border-0 file:bg-rose-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  disabled={!isLoggedIn}
                />
              </label>
            </div>

            {draft.imageDataUrl && (
              <RecipeImage
                src={draft.imageDataUrl}
                alt="Förhandsvisning"
                className="h-44 w-full rounded-md object-cover sm:w-80"
              />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSaving || !isLoggedIn}
                className="inline-flex h-12 items-center justify-center rounded-full bg-rose-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Sparar..." : "Spara recept"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReceptPage;
