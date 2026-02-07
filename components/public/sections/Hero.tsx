"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, TrendingUp } from "lucide-react";
import { reveal, staggerFast, fadeUpSoft } from "@/app/animations";

import Chip from "@/components/public/ui/Chip";
import Button from "@/components/public/ui/Button";
import MediaSlider from "@/components/public/ui/MediaSlider";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-12 md:px-6 md:pt-20 md:pb-14 grid md:grid-cols-2 gap-10 items-center">

      {/* Content */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="show"
        className="space-y-4 md:space-y-5"
      >
        <motion.div variants={fadeUpSoft}>
          <Chip className="flex items-center gap-2 w-fit text-xs md:text-sm">
            <Sparkles size={14} /> Trusted Ayurvedic Franchise Brand
          </Chip>
        </motion.div>

        <motion.h1
          variants={fadeUpSoft}
          className="text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight text-slate-900 dark:text-white"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
            Vedic Wellness
          </span>
          <br />
          Premium Ayurvedic Care
        </motion.h1>

        <motion.p
          variants={fadeUpSoft}
          className="text-sm md:text-base text-slate-700 dark:text-slate-300"
        >
          Vedic Wellness (A Division of Innovia Drugs) offers a strong Ayurvedic
          portfolio for PCD partners — monopoly rights, marketing support, fast
          dispatch and high-demand products.
        </motion.p>

        {/* Feature chips */}
        <motion.div
          variants={fadeUpSoft}
          className="flex gap-2 overflow-x-auto pb-1 md:overflow-visible md:flex-wrap"
        >
          <Chip className="flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck size={14} /> Quality Assured
          </Chip>
          <Chip className="flex items-center gap-1 whitespace-nowrap">
            <Truck size={14} /> Fast Dispatch
          </Chip>
          <Chip className="flex items-center gap-1 whitespace-nowrap">
            <TrendingUp size={14} /> High Margins
          </Chip>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUpSoft}
          className="flex flex-col md:flex-row gap-3 pt-2"
        >
          <Button size="lg" className="w-full md:w-auto">
            Explore Products
          </Button>
          <Button size="lg" variant="secondary" className="w-full md:w-auto">
            Partner With Us
          </Button>
        </motion.div>
      </motion.div>

      {/* Media — bottom on mobile, right on desktop */}
      <motion.div
        variants={reveal}
        initial="hidden"
        animate="show"
        className="mt-8 md:mt-0"
      >
        <MediaSlider
          images={["/promo1.jpg", "/promo2.jpg", "/promo3.jpg"]}
        />
      </motion.div>

    </section>
  );
}
