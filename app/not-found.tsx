"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import PageHeader from "@/components/public/ui/PageHeader";
import { SearchX } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center bg-white/90 dark:bg-[#111]/80 backdrop-blur-sm">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#039751]/10 dark:bg-[#84eb4b]/10">
            <SearchX size={22} className="text-[#039751] dark:text-[#84eb4b]" />
          </span>
        </div>

        <PageHeader 
          title="Page not found" 
          subtitle="The page you're looking for doesn't exist or may have been moved." 
        />

        <div className="mt-7 flex justify-center">
          <Button onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      </Card>
    </main>
  );
}