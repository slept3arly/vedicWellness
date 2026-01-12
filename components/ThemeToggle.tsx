"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-xl px-4 py-2 text-sm font-semibold
        bg-black/10 hover:bg-black/15 dark:bg-white/10 dark:hover:bg-white/15
        border border-black/10 dark:border-white/10 transition"
    >
      {currentTheme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
