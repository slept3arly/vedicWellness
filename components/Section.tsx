"use client";

import { motion } from "framer-motion";

export default function Section({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        w-full rounded-2xl p-6
        border backdrop-blur-md
        bg-white/70 border-black/10
        dark:bg-white/5 dark:border-white/10
      "
    >
      <h3 className="text-xl font-bold text-black dark:text-white">{title}</h3>
      <p className="mt-2 leading-relaxed text-black/70 dark:text-white/70">{text}</p>
    </motion.div>
  );
}
