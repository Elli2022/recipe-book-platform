import React from "react";

const URL_IN_TEXT = /(https?:\/\/[^\s]+)/;

export function recipeSourceHref(source?: string): string | null {
  if (!source?.trim()) {
    return null;
  }
  const match = source.trim().match(URL_IN_TEXT);
  return match?.[1] ?? (source.startsWith("http") ? source.trim() : null);
}

export function recipeSourceLabel(source?: string): string {
  if (!source?.trim()) {
    return "";
  }
  const href = recipeSourceHref(source);
  if (!href) {
    return source.trim();
  }
  if (href.includes("arla.se")) {
    return "Arla";
  }
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "källan";
  }
}

type RecipeAttributionProps = {
  ownerName?: string;
  sourceImage?: string;
  className?: string;
};

export function RecipeAttribution({
  ownerName,
  sourceImage,
  className = "",
}: RecipeAttributionProps) {
  if (!ownerName?.trim() && !sourceImage?.trim()) {
    return null;
  }

  const sourceHref = recipeSourceHref(sourceImage);
  const sourceLabel = recipeSourceLabel(sourceImage);

  return (
    <div className={`space-y-1 text-sm text-stone-500 ${className}`.trim()}>
      {ownerName?.trim() && (
        <p>
          Tipsat av <span className="font-medium text-stone-700">{ownerName}</span>
        </p>
      )}
      {sourceImage?.trim() && (
        <p>
          Recept och bild från{" "}
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-rose-700 underline hover:text-rose-800"
            >
              {sourceLabel}
            </a>
          ) : (
            <span className="font-medium text-stone-700">{sourceImage}</span>
          )}
        </p>
      )}
    </div>
  );
}
