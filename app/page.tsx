"use client";


import Hero from "@/components/Hero";
import Section from "@/components/Section";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>
      
      <main>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Hero />
          </motion.div>
        
      </main>

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
  );
}
