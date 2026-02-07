"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="
        px-4 py-2 rounded-full text-sm
        bg-[var(--bg-surface)]
        border border-[var(--border-soft)]
        shadow-sm hover:shadow-md transition
      "
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
