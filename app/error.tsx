"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Centered error container */}
      <Card className="max-w-lg w-full text-center bg-white/85 dark:bg-black/50">
        <h1 className="text-3xl font-extrabold">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm text-muted">
          An unexpected issue occurred. Please try again or return home.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>
            Try again
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push("/")}
          >
            Go home
          </Button>
        </div>
      </Card>
    </main>
  );
}
