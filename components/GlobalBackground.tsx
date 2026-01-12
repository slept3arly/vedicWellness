"use client";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#F7F8FA] dark:bg-black" />

      {/* Soft corner tints (NO blobs) */}
      <div
        className="
          absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full
          bg-green-400/70 blur-[120px]
          dark:bg-green-500/12
        "
      />
      <div
        className="
          absolute -bottom-48 -right-48 lg  h-[40rem] w-[40rem] rounded-full
          bg-emerald-400/70 blur-[140px]
          dark:bg-emerald-500/25
        "
      />

      {/* Soft center wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/90 dark:from-black/40 dark:to-black/70" />

      {/* subtle noise (optional) */}
      {/* if you don’t have noise.png, comment this out */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('/noise.png')]" />
    </div>
  );
}
