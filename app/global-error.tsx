"use client";

import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import { AlertTriangle } from "lucide-react";

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
        <main className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#0d0d0d]">
          <Card className="max-w-md w-full text-center bg-white/90 dark:bg-[#111]/80 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/40">
                <AlertTriangle size={22} className="text-red-500 dark:text-red-400" />
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isDev
                ? "Global error boundary (development)."
                : "An unexpected system error occurred."}
            </p>

            {isDev && (
              <pre className="mt-5 max-h-60 overflow-auto rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 text-xs text-left text-slate-700 dark:text-slate-300">
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