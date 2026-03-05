"use client";

import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2 } from "lucide-react";

import Chip from "@/components/public/ui/Chip";
import Button from "@/components/public/ui/Button";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-12 md:px-6 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
      {/* LEFT */}
      <div className="space-y-4 md:space-y-5">
        <div>
          <Chip className="flex items-center gap-2 w-fit text-xs md:text-sm">
            <Sparkles size={14} />
            Trusted Ayurvedic Franchise Network
          </Chip>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight text-slate-900 dark:text-white">
          Build Your Monopoly With
          <br />
          {/* Light: dark green → mid green. Dark: lime → brighter lime */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#039751] to-[#04c468] dark:from-[#84eb4b] dark:to-[#a3e635]">
            Vedic Wellness
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          Vedic Wellness (A Division of Innovia Drugs) enables serious PCD
          partners to build scalable, long-term businesses with GMP certified
          Ayurvedic formulations and monopoly rights.
        </p>

        <div className="flex gap-3 pt-2">
          <Button onClick={() => router.push("/contact")}>
            Apply for Franchise
          </Button>

          <Button variant="secondary" onClick={() => router.push("/products")}>
            View Products
          </Button>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <div className="relative rounded-3xl bg-white/70 dark:bg-black/45 p-6 md:p-8 shadow-[0_24px_60px_rgba(2,101,54,0.25)] dark:shadow-[0_24px_60px_rgba(132,235,75,0.08)]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[#039751]/15 dark:bg-[#84eb4b]/10 blur-2xl opacity-40" />

          <div className="relative space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">
              Why Serious Partners Choose Us
            </h3>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {[
                "Monopoly-based PCD model",
                "GMP certified manufacturing",
                "Fast dispatch & logistics support",
              ].map((item) => (
                <li key={item} className="flex gap-2 items-start">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-[#039751] dark:text-[#84eb4b]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}