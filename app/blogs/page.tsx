"use client";

import Section from "@/components/Section";
import { motion } from "framer-motion";

export default function About() {
  return (    
    <div className="flex flex-col min-h-screen items-center gap-3 py-40 px-4">
      
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .4 }}
        className="text-4xl font-noto"
      >
        Blog Page
      </motion.h1>

        <motion.h5
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .4, delay:0.2 }}
        className="text-1xl"
      >
        This is the blogs page
      </motion.h5>

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
