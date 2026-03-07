"use client";

import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import PageHeader from "@/components/public/ui/PageHeader";
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

            <PageHeader
              title="Something went wrong"
              subtitle={
                isDev
                  ? "Global error boundary (development)."
                  : "An unexpected system error occurred."
              }
            />

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