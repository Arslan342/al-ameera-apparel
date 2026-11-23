"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxMediaProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  intensity?: number;
  priority?: boolean;
  children?: React.ReactNode;
}

export default function ParallaxMedia({
  src,
  fallbackSrc = "/images/hero-atelier.jpg",
  alt,
  className = "",
  imgClassName = "",
  intensity = 30,
  priority = false,
  children,
}: ParallaxMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = 0;

    const update = () => {
      const container = containerRef.current;
      const img = mediaRef.current;
      if (!container || !img) return;

      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < -120 || rect.top > viewH + 120) return;

      const progress = (viewH - rect.top) / (viewH + rect.height);
      const centered = (progress - 0.5) * 2;
      const offset = Math.max(-intensity, Math.min(intensity, centered * intensity));
      img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.1)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [intensity]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={mediaRef}
        src={imgSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onError={() => {
          if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
        }}
        className={`absolute inset-0 w-full h-full object-cover object-center will-change-transform ${imgClassName}`}
        style={{ transform: "scale(1.1)" }}
      />
      {children}
    </div>
  );
}
