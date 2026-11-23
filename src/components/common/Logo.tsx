import Link from "next/link";
import BrandMark from "./BrandMark";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  className = "",
  variant = "dark",
  showSubtitle = false,
  size = "md",
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 select-none focus:outline-none ${className}`}
      aria-label="Al-Ameera Apparel (Pvt.) Ltd. — Return to Homepage"
    >
      <BrandMark size={size} variant={variant} />

      {/* Architectural vertical divider */}
      <span
        aria-hidden="true"
        className={`h-7 w-[1px] shrink-0 transition-colors ${
          isLight ? "bg-white/15" : "bg-[#0d1626]/12"
        }`}
      />

      {/* Balanced 2-Line Editorial Wordmark */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-display font-bold uppercase leading-none tracking-[0.13em] transition-colors ${
            size === "sm"
              ? "text-[13px]"
              : size === "lg"
              ? "text-[18px]"
              : "text-[15px] sm:text-[16px]"
          } ${isLight ? "text-white" : "text-[#0d1626] group-hover:text-[#1d3a63]"}`}
        >
          Al-Ameera
        </span>

        <span
          className={`font-sans font-semibold uppercase leading-none tracking-[0.2em] mt-1.5 ${
            size === "sm" ? "text-[8px]" : "text-[9px] sm:text-[9.5px]"
          } ${isLight ? "text-[#e2c26b]" : "text-[#9c7629]"}`}
        >
          {showSubtitle ? "Apparel (Pvt.) Ltd. · Karachi" : "Apparel (Pvt.) Ltd."}
        </span>
      </div>
    </Link>
  );
}
