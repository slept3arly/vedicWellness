export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#F4F7F5] dark:bg-[#04060a]" />

      {/* Primary green spotlight (strong & visible) */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_65%_18%,rgba(110,230,160,0.65),transparent_52%)]
          dark:bg-[radial-gradient(circle_at_65%_18%,rgba(90,200,140,0.45),transparent_58%)]
        "
      />

      {/* Secondary emerald depth */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_22%_82%,rgba(0,160,95,0.55),transparent_60%)]
          dark:bg-[radial-gradient(circle_at_22%_82%,rgba(0,160,95,0.42),transparent_66%)]
        "
      />

      {/* Top light bloom (visible but controlled) */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_28%_10%,rgba(255,255,255,0.95),transparent_48%)]
          dark:bg-[radial-gradient(circle_at_28%_10%,rgba(255,255,255,0.18),transparent_55%)]
        "
      />

      {/* Contrast vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-white/85 dark:from-black/30 dark:to-black/90" />

      {/* Fine visible grain (premium texture) */}
      <div
        className="
          absolute inset-0
          opacity-[0.04]
          mix-blend-overlay
          bg-[repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.06),
            rgba(255,255,255,0.06) 1px,
            transparent 1px,
            transparent 2px
          )]
        "
      />
    </div>
  );
}
