"use client";

import { useEffect, useRef } from "react";

/**
 * Calm architectural frosted daylight mesh canvas.
 * Gently shifts tonal depth with scroll so translucent glass panels
 * refract soft natural light without neon or sci-fi glare.
 */
export default function AmbientBackdrop() {
  const layerOneRef = useRef<HTMLDivElement>(null);
  const layerTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const shiftOne = Math.min(160, y * 0.045);
        const shiftTwo = Math.min(180, y * 0.035);
        if (layerOneRef.current) {
          layerOneRef.current.style.transform = `translate3d(0, ${-shiftOne}px, 0)`;
        }
        if (layerTwoRef.current) {
          layerTwoRef.current.style.transform = `translate3d(0, ${shiftTwo}px, 0)`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#eef2f7]"
    >
      {/* Base alabaster-to-pearl wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #f7f8fa 0%, #eaeff6 42%, #f3efe9 76%, #e7edf5 100%)",
        }}
      />

      {/* Soft daylight architectural tonal clouds */}
      <div
        ref={layerOneRef}
        className="absolute -top-32 -left-24 w-[62vw] h-[62vw] max-w-[820px] max-h-[820px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(196, 212, 232, 0.62) 0%, rgba(215, 226, 240, 0.22) 52%, transparent 74%)",
          filter: "blur(56px)",
        }}
      />

      <div
        ref={layerTwoRef}
        className="absolute top-[28%] -right-28 w-[58vw] h-[58vw] max-w-[780px] max-h-[780px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(235, 223, 203, 0.62) 0%, rgba(242, 234, 222, 0.24) 55%, transparent 75%)",
          filter: "blur(64px)",
        }}
      />

      <div
        className="absolute -bottom-40 left-[24%] w-[54vw] h-[54vw] max-w-[720px] max-h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(203, 216, 233, 0.5) 0%, rgba(226, 234, 244, 0.16) 55%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
