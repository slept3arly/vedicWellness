"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <html>
      <body>
        <main className="items-center text-center mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-2xl font-bold">Critical error</h1>

          <p className="mt-2 text-sm text-slate-600">
            {isDev
              ? "This is the global error boundary (dev)."
              : "Something went wrong."}
          </p>

          {isDev ? (
            <pre className="mt-6 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
              {String(error?.stack || error?.message || error)}
            </pre>
          ) : null}

          <div className="mt-8">
            <button
              onClick={() => reset()}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
