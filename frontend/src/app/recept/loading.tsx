import RecipeListSkeleton from "@/app/components/RecipeListSkeleton";

export default function ReceptLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="h-4 w-28 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-10 w-2/3 max-w-md animate-pulse rounded bg-stone-200" />
        </header>
        <RecipeListSkeleton />
      </main>
    </div>
  );
}
