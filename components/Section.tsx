"use client";

import { motion } from "framer-motion";

export default function Section({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: .8 }}
      viewport={{ once: false }}
      className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
    >
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="max-w-xl text-gray-400">{text}</p>
    </motion.section>
  );
}
