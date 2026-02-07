"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageCircle,
  FileText,
  Info,
} from "lucide-react";

import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function FranchiseCTA() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* ENTRY animation only */}
        <motion.div variants={fadeUp}>
          <Card
            className="
              bg-white/80 dark:bg-black/50
               
              border border-[var(--border-soft)]
            "
          >
            <div className="space-y-8">
              {/* Heading */}
              <div className="max-w-2xl space-y-3">
                <span className="text-sm font-semibold text-[color:var(--brand-accent)]">
                  PCD Franchise Enquiry
                </span>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Franchise Opportunities in Your Area
                </h2>

                <p className="text-sm md:text-base text-muted leading-relaxed">
                  Access product catalogs, distributor schemes, and monopoly
                  availability. Clear information, verified details, and direct support.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button
                  size="lg"
                  className="w-full shadow-md"
                  onClick={() => router.push("/contact")}
                >
                  <FileText size={18} className="mr-2" />
                  Fill Enquiry Form
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full shadow-md"
                  onClick={() =>
                    window.open("https://wa.me/+919306025799", "_blank")
                  }
                >
                  <MessageCircle size={18} className="mr-2" />
                  WhatsApp Us
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full shadow-md"
                  onClick={() =>
                    (window.location.href = "tel:+919306025799")
                  }
                >
                  <Phone size={18} className="mr-2" />
                  Call Us
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full shadow-md"
                  onClick={() => router.push("/about")}
                >
                  <Info size={18} className="mr-2" />
                  About Us
                </Button>
              </div>

              <p className="text-xs text-muted">
                Trusted by distributors across multiple states • Response within
                24 hours
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
