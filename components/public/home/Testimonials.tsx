"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Briefcase, TrendingUp, Users } from "lucide-react";
import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";

const reviews = [
  {
    name: "Distributor Partner",
    city: "Maharashtra",
    role: "Wholesale Distributor",
    impact: "+42% Revenue Growth",
    text: "Excellent margins, reliable supply and strong repeat demand helped us scale quickly.",
  },
  {
    name: "Medical Representative",
    city: "Uttar Pradesh",
    role: "Field Sales",
    impact: "3x Doctor Engagement",
    text: "Marketing support and product quality made doctor conversions easier.",
  },
  {
    name: "Franchise Owner",
    city: "Gujarat",
    role: "Regional Partner",
    impact: "+65% Monthly Orders",
    text: "Support team is responsive and schemes are attractive.",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-12"
      >
        <motion.header variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by Growing Partners
          </h2>
          <p className="mt-2 text-muted">
            Real results from franchise owners across India.
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <motion.div key={r.city} variants={fadeUp}>
              <Card className="bg-white/75 dark:bg-black/45">
                <p className="italic">“{r.text}”</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-semibold text-[color:var(--brand-accent)]">
                    {r.impact}
                  </span>
                  <div className="flex text-[color:var(--brand-accent)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div className="mt-4 border-t pt-3">
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-muted">{r.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
