"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center bg-white/80 dark:bg-black/45">
        <h1 className="text-2xl font-extrabold">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-muted">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-6 flex justify-center">
          <Button onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      </Card>
    </main>
  );
}
