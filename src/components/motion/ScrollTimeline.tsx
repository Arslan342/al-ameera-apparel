"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  Layers,
  Scissors,
  Factory,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import Reveal from "./Reveal";
import GlassCard from "./GlassCard";

const iconMap = {
  clipboard: ClipboardList,
  layers: Layers,
  scissors: Scissors,
  factory: Factory,
  shield: ShieldCheck,
  package: PackageCheck,
} as const;

export type TimelineIconKey = keyof typeof iconMap;

export interface TimelineStep {
  number: string;
  title: string;
  desc: string;
  icon: TimelineIconKey;
}

interface ScrollTimelineProps {
  steps: TimelineStep[];
}

export default function ScrollTimeline({ steps }: ScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.72;
      const total = rect.height;
      const scrolled = start - rect.top;
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setFillPct(pct);
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
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Vertical glass spine on md+ */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 rounded-full bg-slate-900/10 overflow-hidden"
      >
        <div
          className="w-full rounded-full bg-gradient-to-b from-[#1d3a63] via-[#355684] to-[#b8913f] transition-all duration-150 ease-out"
          style={{ height: `${fillPct}%` }}
        />
      </div>

      <div className="space-y-6 md:space-y-10">
        {steps.map((step, index) => {
          const Icon = iconMap[step.icon];
          const isLeft = index % 2 === 0;
          const stepThreshold = ((index + 0.35) / steps.length) * 100;
          const isLit = fillPct >= stepThreshold;

          return (
            <div
              key={step.number}
              className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6"
            >
              {/* Left side card or spacer */}
              <div className={`md:col-span-5 ${isLeft ? "md:order-1" : "md:order-3"}`}>
                <Reveal
                  direction={isLeft ? "right" : "left"}
                  delay={80}
                  distance={22}
                >
                  <GlassCard className="p-6 sm:p-7 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0f1a2e]/8 border border-white/80 text-[#1d3a63] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-semibold tracking-widest text-[#b8913f] uppercase">
                        Stage {step.number}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-[#0d1626] text-lg leading-snug mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#526075] leading-relaxed">{step.desc}</p>
                  </GlassCard>
                </Reveal>
              </div>

              {/* Center node on md+ */}
              <div className="hidden md:flex md:col-span-2 md:order-2 justify-center">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 ${
                    isLit
                      ? "bg-[#0f1a2e] text-white shadow-lg shadow-[#0f1a2e]/25 ring-4 ring-white/80 scale-105"
                      : "glass-pill text-[#526075]"
                  }`}
                >
                  {step.number}
                </div>
              </div>

              {/* Opposite empty column for alternating editorial rhythm */}
              <div
                aria-hidden="true"
                className={`hidden md:block md:col-span-5 ${isLeft ? "md:order-3" : "md:order-1"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
