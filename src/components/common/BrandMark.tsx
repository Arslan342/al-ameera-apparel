interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Precision-engineered interlocking "AA" monogram emblem for Al-Ameera Apparel (Pvt.) Ltd.
 * Built on a symmetrical 48x48 architectural grid with a champagne-gold crossbar thread.
 */
export default function BrandMark({
  size = "md",
  variant = "dark",
  className = "",
}: BrandMarkProps) {
  const isLight = variant === "light";

  const boxSize =
    size === "sm"
      ? "w-8 h-8 rounded-[10px]"
      : size === "lg"
      ? "w-12 h-12 rounded-[15px]"
      : "w-10 h-10 rounded-[12px]";

  return (
    <div
      className={`relative shrink-0 ${boxSize} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] ${
        isLight
          ? "bg-gradient-to-br from-white/14 to-white/[0.04] border border-[#e2c26b]/35 backdrop-blur-md shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.22)]"
          : "bg-gradient-to-br from-[#162542] to-[#0a1222] border border-[#d4af37]/30 shadow-[0_10px_22px_-8px_rgba(10,18,34,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]"
      } ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="aa-gold-thread" x1="12" y1="28.5" x2="36" y2="28.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C8A042" />
            <stop offset="50%" stopColor="#EED484" />
            <stop offset="100%" stopColor="#C8A042" />
          </linearGradient>
        </defs>

        {/* Subtle inner architectural hairline frame */}
        <rect
          x="3.5"
          y="3.5"
          width="41"
          height="41"
          rx="8.5"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.75"
        />

        {/* Right Interlocking 'A' (Soft Platinum) */}
        <path
          d="M 19.5 35.5 L 28.7 12.5 L 30.1 12.5 L 39.3 35.5"
          stroke="#CBD5E1"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Interlocking 'A' (Pure White Foreground) */}
        <path
          d="M 8.7 35.5 L 17.9 12.5 L 19.3 12.5 L 28.5 35.5"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Champagne-Gold Precision Textile Crossbar */}
        <line
          x1="12.6"
          y1="28.5"
          x2="35.4"
          y2="28.5"
          stroke="url(#aa-gold-thread)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Central Diamond Stitch Nexus at Intersection (24, 23.5) */}
        <polygon points="24,21.4 26.1,23.5 24,25.6 21.9,23.5" fill="#E6C56B" />
      </svg>
    </div>
  );
}
