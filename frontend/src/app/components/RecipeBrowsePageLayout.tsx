import type { ReactNode } from "react";

type RecipeBrowsePageLayoutProps = {
  title: string;
  description: string;
  eyebrow?: string;
  titleAs?: "h1" | "h2";
  controls: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
};

const RecipeBrowsePageLayout = ({
  title,
  description,
  eyebrow = "Hitta recept",
  titleAs = "h1",
  controls,
  headerActions,
  children,
}: RecipeBrowsePageLayoutProps) => {
  const TitleTag = titleAs;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
          {eyebrow}
        </p>
        <TitleTag className="mt-2 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
          {title}
        </TitleTag>
        <p className="mt-3 max-w-2xl text-lg text-stone-600">{description}</p>

        <div className="mt-6 space-y-4">
          {controls}
          {headerActions}
        </div>
      </header>

      {children}
    </main>
  );
};

export default RecipeBrowsePageLayout;
