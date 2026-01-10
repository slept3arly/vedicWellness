"use client";

import Section from "@/components/Section";
import { motion } from "framer-motion";

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
    <div className="flex flex-col items-center gap-3 py-40 px-4">
      <div className="min-h-screen w-full max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl"
        >
          Our Products
        </motion.h1>

        <motion.h5
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-1xl opacity-70"
        >
          Browse our Ayurvedic products
        </motion.h5>

        {/* PRODUCTS GRID */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="border border-neutral-800 rounded-2xl p-4 bg-black/30"
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-44 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-44 bg-neutral-900 rounded-xl flex items-center justify-center opacity-60">
                  No image
                </div>
              )}

              <div className="mt-4">
                <h2 className="text-xl font-semibold">{p.name}</h2>

                {p.price !== null ? (
                  <p className="mt-1 opacity-80">₹{p.price}</p>
                ) : (
                  <p className="mt-1 opacity-50">Price not set</p>
                )}

                {p.description ? (
                  <p className="mt-2 text-sm opacity-70">{p.description}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* OLD SECTIONS (keep them if you want) */}
        <div className="mt-20">
          <Section
            title="About Innovia"
            text="Innovia Drugs is focused on building innovative healthcare solutions that improve lives."
          />

          <Section
            title="Our Mission"
            text="We combine technology, research, and design to create modern digital healthcare experiences."
          />

          <Section
            title="Why Choose Us"
            text="Clean design, fast performance, and smooth user experiences built with modern tools."
          />
        </div>
      </div>
    </div>
  );
}
