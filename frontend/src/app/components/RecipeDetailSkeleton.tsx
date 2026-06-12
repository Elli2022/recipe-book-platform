import Footer from "./Footer";
import Navbar from "./Navbar";

type RecipeDetailSkeletonProps = {
  showNavbar?: boolean;
};

const RecipeDetailSkeleton = ({ showNavbar = false }: RecipeDetailSkeletonProps) => (
  <div className="min-h-screen bg-stone-50">
    {showNavbar && <Navbar />}
    <main
      className="mx-auto max-w-6xl px-4 py-8 sm:py-10"
      aria-busy="true"
      aria-label="Laddar recept"
    >
      <div className="h-4 w-36 animate-pulse rounded bg-stone-200" />
      <section className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-stone-200 lg:h-[420px]" />
        <div className="space-y-4">
          <div className="h-12 w-full animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100" />
          <div className="h-20 animate-pulse rounded-lg bg-stone-100" />
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default RecipeDetailSkeleton;
