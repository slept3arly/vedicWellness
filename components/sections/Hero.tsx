"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, TrendingUp } from "lucide-react";
import { reveal, staggerFast, fadeUpSoft } from "@/app/animations";

import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import MediaSlider from "@/components/ui/MediaSlider";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-14 grid md:grid-cols-2 gap-12 items-center">

      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        <motion.div variants={fadeUpSoft}>
          <Chip className="flex items-center gap-2 w-fit">
            <Sparkles size={14}/> Trusted Ayurvedic Franchise Brand
          </Chip>
        </motion.div>

        <motion.h1
          variants={fadeUpSoft}
          className="text-5xl font-extrabold leading-tight text-slate-900 dark:text-white"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
            Vedic Wellness
          </span>
          <br />
          Premium Ayurvedic Care
        </motion.h1>

        <motion.p
          variants={fadeUpSoft}
          className="text-slate-700 dark:text-slate-300 max-w-xl"
        >
          Vedic Wellness (A Division of Innovia Drugs) offers a strong Ayurvedic
          portfolio for PCD partners — monopoly rights, marketing support, fast
          dispatch and high-demand products.
        </motion.p>

        <motion.div
          variants={fadeUpSoft}
          className="flex flex-wrap gap-2"
        >
          <Chip className="flex items-center gap-1"><ShieldCheck size={14}/> Quality Assured</Chip>
          <Chip className="flex items-center gap-1"><Truck size={14}/> Fast Dispatch</Chip>
          <Chip className="flex items-center gap-1"><TrendingUp size={14}/> High Margins</Chip>
        </motion.div>

        <motion.div
          variants={fadeUpSoft}
          className="flex gap-3 pt-2"
        >
          <Button size="lg">Explore Products</Button>
          <Button size="lg" variant="secondary">Partner With Us</Button>
        </motion.div>
      </motion.div>

      <motion.div variants={reveal} initial="hidden" animate="show">
        <MediaSlider
          images={["/promo1.jpg", "/promo2.jpg", "/promo3.jpg"]}
        />
      </motion.div>

    </section>
  );
}
