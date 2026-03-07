"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/public/ui/Button";

export default function HeroButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-3 pt-2">
      <Button onClick={() => router.push("/contact")}>
        Apply for Franchise
      </Button>
      <Button variant="secondary" onClick={() => router.push("/products")}>
        View Products
      </Button>
    </div>
  );
}