"use client";

import { useState } from "react";

interface SafeImageProps {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export default function SafeImage({
  src,
  fallbackSrc = "/images/cat-knitwear.jpg",
  alt,
  className = "",
  loading = "lazy",
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
      className={className}
    />
  );
}
