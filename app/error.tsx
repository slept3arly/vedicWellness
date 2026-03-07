"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import PageHeader from "@/components/public/ui/PageHeader";
import { AlertTriangle } from "lucide-react";

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
      <Card className="max-w-md w-full text-center bg-white/90 dark:bg-[#111]/80 backdrop-blur-sm">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/40">
            <AlertTriangle size={22} className="text-red-500 dark:text-red-400" />
          </span>
        </div>

        <PageHeader 
          title="Something went wrong" 
          subtitle="An unexpected issue occurred. Please try again or return home." 
        />

        <div className="mt-7 flex justify-center gap-3">
          <Button onClick={reset}>
            Try again
          </Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Go home
          </Button>
        </div>
      </Card>
    </main>
  );
}