"use client";

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {/* Base tone */}
      <div className="absolute inset-0 bg-[#F7F8FA] dark:bg-[#04060a]" />

      {/* Main green glow — stronger */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_70%_25%,rgba(132,235,75,0.65),transparent_58%)]
          dark:bg-[radial-gradient(circle_at_70%_25%,rgba(132,235,75,0.38),transparent_62%)]
        "
      />

      {/* Deeper emerald depth */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_30%_85%,rgba(3,151,81,0.65),transparent_62%)]
          dark:bg-[radial-gradient(circle_at_30%_85%,rgba(3,151,81,0.45),transparent_68%)]
        "
      />

      {/* Light bloom for premium softness */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.95),transparent_52%)]
          dark:bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_60%)]
        "
      />

      {/* Depth vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-transparent to-white/85 dark:from-black/35 dark:to-black/80" />

      {/* Ultra subtle grain */}
      <div
        className="
          absolute inset-0
          opacity-[0.035]
          mix-blend-overlay
          bg-[repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.045),
            rgba(255,255,255,0.045) 1px,
            transparent 1px,
            transparent 2px
          )]
        "
      />
    </div>
  );
}
