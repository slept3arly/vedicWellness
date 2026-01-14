"use client";

import { motion } from "framer-motion";
import { Sparkles, BadgeCheck, Truck, MapPin } from "lucide-react";
import Image from "next/image";

import PageHeader from "@/components/ui/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Chip from "@/components/ui/Chip";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  published: boolean;
};

export default function ProductsClient({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Ayurvedic Products
            </p>
          }
          title={
            <>
              Explore our{" "}
              <span className="text-w dark:text-green-400">product range</span>
            </>
          }
          subtitle="Premium Ayurvedic formulations designed for demand, trust and repeat customers — ideal for PCD pharma franchise partners."
        />

        {/* Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["High Demand", "Premium Packaging", "PCD Ready", "Fast Dispatch"].map(
            (t) => (
              <Chip key={t}>{t}</Chip>
            )
          )}
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "WHO-GMP Quality",
              desc: "Consistent manufacturing standards",
              icon: BadgeCheck,
            },
            {
              title: "Fast Dispatch",
              desc: "Quick packaging + shipping support",
              icon: Truck,
            },
            {
              title: "Monopoly Rights",
              desc: "Area-based franchise availability",
              icon: MapPin,
            },
          ].map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                  <i.icon size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    {i.title}
                  </h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-300">
                    {i.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading
            title="Products Catalog"
            subtitle="Browse our available Ayurvedic products"
          />

          {/* PRODUCTS GRID */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
              >
                <GlassCard className="overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44 w-full">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={`${p.name} Ayurvedic Product`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={idx < 3} // ✅ helps LCP / CWV
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-200/40 dark:bg-slate-800/40 flex items-center justify-center text-sm text-slate-600 dark:text-slate-300">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-heading text-lg font-extrabold text-slate-900 dark:text-white">
                      {p.name}
                    </h2>

                    <p className="mt-1 font-body text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {p.description || "High-demand Ayurvedic product."}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        {p.price !== null ? `₹${p.price}` : "Price on request"}
                      </span>

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        View →
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Empty */}
          {products.length === 0 ? (
            <div className="mt-10">
              <GlassCard className="p-8 text-center">
                <p className="font-body text-slate-700 dark:text-slate-300">
                  No products published yet.
                </p>
              </GlassCard>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
