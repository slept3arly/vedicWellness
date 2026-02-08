"use client";

import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

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
        <main className="min-h-screen flex items-center justify-center px-4">
          <Card className="max-w-lg w-full text-center bg-white/85 dark:bg-black/50">
            <h1 className="text-2xl font-extrabold">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm text-muted">
              {isDev
                ? "Global error boundary (development)."
                : "An unexpected system error occurred."}
            </p>

            {isDev && (
              <pre className="mt-6 max-h-60 overflow-auto rounded-xl border border-[var(--border-soft)] bg-black/5 dark:bg-white/5 p-4 text-xs text-left">
                {String(error?.stack || error?.message || error)}
              </pre>
            )}

            <div className="mt-6 flex justify-center">
              <Button onClick={reset}>
                Try again
              </Button>
            </div>
          </Card>
        </main>
      </body>
    </html>
  );
}
