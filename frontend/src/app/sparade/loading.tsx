import RecipeListSkeleton from "@/app/components/RecipeListSkeleton";

export default function SparadeLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <section className="max-w-3xl">
          <div className="mb-3 h-4 w-32 animate-pulse rounded bg-stone-200" />
          <div className="h-12 w-full max-w-lg animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-6 w-full max-w-md animate-pulse rounded bg-stone-100" />
        </section>
        <RecipeListSkeleton count={3} />
      </main>
    </div>
  );
}
