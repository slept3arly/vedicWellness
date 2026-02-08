"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle, FileText, Info } from "lucide-react";

import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function FranchiseCTA() {
  const router = useRouter();

  const handleWhatsApp = () =>
    window.open("https://wa.me/+919306025799", "_blank");

  const handleCall = () =>
    (window.location.href = "tel:+919306025799");

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp}>
          <Card className="bg-white/80 dark:bg-black/50">
            <div className="space-y-8">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Franchise Opportunities in Your Area
                </h2>
                <p className="text-muted">
                  Verified details, clear support, fast response.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button onClick={() => router.push("/contact")}>
                  <FileText size={18} className="mr-2" />
                  Enquiry Form
                </Button>
                <Button variant="secondary" onClick={handleWhatsApp}>
                  <MessageCircle size={18} className="mr-2" />
                  WhatsApp
                </Button>
                <Button variant="secondary" onClick={handleCall}>
                  <Phone size={18} className="mr-2" />
                  Call Us
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/about")}
                >
                  <Info size={18} className="mr-2" />
                  About Us
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
