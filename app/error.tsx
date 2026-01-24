"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    // Always log in console for dev debugging
    console.error(error);
  }, [error]);

  return (
    <main className="items-center text-center mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Something went wrong</h1>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {isDev
          ? "This error screen is shown because you're in development."
          : "An unexpected error occurred."}
      </p>

      {isDev ? (
        <pre className="mt-6 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          {String(error?.stack || error?.message || error)}
        </pre>
      ) : null}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Try again
        </button>

        <a
          href="/"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
        >
          Go home
        </a>
      </div>
    </main>
  );
}
