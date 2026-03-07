"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

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
  {
    name: "Retail Pharmacy Partner",
    city: "Tamil Nadu",
    role: "Pharmacy Chain Owner",
    impact: "+38% Sell-through Rate",
    text: "The product range fills a clear gap in our market. Customers keep coming back for repeat purchases.",
  },
  {
    name: "Area Sales Manager",
    city: "Rajasthan",
    role: "Territory Manager",
    impact: "2x Territory Coverage",
    text: "Training materials and field support gave my team the confidence to expand into new districts.",
  },
  {
    name: "Hospital Supply Partner",
    city: "Karnataka",
    role: "Institutional Distributor",
    impact: "+55% Institutional Orders",
    text: "On-time delivery and consistent quality have made us the preferred supplier across three hospitals.",
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
          <PageHeader
            title="Trusted by Growing Partners"
            subtitle="Real results from franchise owners across India."
          />
        </motion.header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((r) => (
            <motion.div key={r.city} variants={fadeUp} className="group">
              <Card className="bg-white/75 dark:bg-black/45 h-full flex flex-col justify-between p-3 md:p-5">
                <div>
                  <p className="italic text-xs md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                    "{r.text}"
                  </p>
                  <div className="mt-2 md:mt-4 flex justify-between items-center">
                    <span className="font-accent text-[10px] md:text-xs font-semibold text-[color:var(--brand-accent)] uppercase tracking-wider">
                      {r.impact}
                    </span>
                    <div className="flex text-[color:var(--brand-accent)] transition-transform duration-300 group-hover:scale-105">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="md:w-[14px] md:h-[14px]" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-6 border-t border-foreground/10 pt-2 md:pt-4">
                  <p className="font-heading font-semibold text-xs md:text-base text-foreground">
                    {r.name}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-0.5 md:mt-1">
                    {r.role} • {r.city}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}