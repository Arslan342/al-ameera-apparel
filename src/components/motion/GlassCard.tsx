"use client";

import { useRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "strong" | "subtle" | "dark";
  interactive?: boolean;
  className?: string;
}

export default function GlassCard({
  children,
  variant = "default",
  interactive = true,
  className = "",
  onMouseMove,
  ...rest
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const variantClass =
    variant === "strong"
      ? "glass-panel-strong"
      : variant === "subtle"
      ? "glass-panel-subtle"
      : variant === "dark"
      ? "glass-dark"
      : "glass-panel";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty("--gx", `${x}px`);
      cardRef.current.style.setProperty("--gy", `${y}px`);
    }
    if (onMouseMove) onMouseMove(e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`${variantClass} ${interactive ? "glass-interactive" : ""} ${className}`}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
