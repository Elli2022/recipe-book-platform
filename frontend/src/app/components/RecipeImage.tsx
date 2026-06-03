"use client";

import Image from "next/image";

const FALLBACK = "/images/heroImageLandingPage.jpg";

type RecipeImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

const RecipeImage = ({
  src,
  alt,
  className = "h-56 w-full object-cover",
  priority = false,
}: RecipeImageProps) => {
  const resolved = src?.trim() || FALLBACK;
  const unoptimized =
    resolved.startsWith("data:") || resolved.startsWith("blob:");

  return (
    <Image
      src={resolved}
      alt={alt}
      width={800}
      height={450}
      className={className}
      unoptimized={unoptimized}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 33vw"
      onError={(event) => {
        const target = event.currentTarget;
        if (!target.src.endsWith(FALLBACK)) {
          target.src = FALLBACK;
        }
      }}
    />
  );
};

export default RecipeImage;
