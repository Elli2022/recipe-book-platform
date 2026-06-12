const RecipeListSkeleton = ({ count = 6 }: { count?: number }) => (
  <section
    className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    aria-busy="true"
    aria-label="Laddar recept"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm"
      >
        <div className="aspect-[4/3] animate-pulse bg-stone-200" />
        <div className="space-y-3 p-4">
          <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
        </div>
      </div>
    ))}
  </section>
);

export default RecipeListSkeleton;
