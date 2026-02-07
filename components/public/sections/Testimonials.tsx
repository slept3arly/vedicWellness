"use client";

import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Briefcase,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  fadeUp,
  staggerFast,
  cardInteraction,
} from "@/app/animations";

/* ---------------- DATA ---------------- */

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
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-12"
      >
        {/* Heading */}
        <motion.header
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by Growing Partners
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted">
            Real results from distributors and franchise owners across India.
          </p>
        </motion.header>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5">
          <Stat icon={<Users size={22} />} label="Active Partners" value="1,200+" />
          <Stat icon={<TrendingUp size={22} />} label="Average Growth" value="40%+" />
          <Stat icon={<Briefcase size={22} />} label="Cities Covered" value="85+" />
        </div>

        {/* Reviews */}
        <div className="grid lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <motion.div key={r.city} variants={fadeUp} className="group">
              <motion.div
                variants={cardInteraction}
                initial="rest"
                whileHover="hover"
                className="
                  bg-white/75 dark:bg-black/45
                  backdrop-blur-sm
                  rounded-2xl
                  p-6
                  transition-shadow duration-300
                  group-hover:shadow-[0_18px_45px_rgba(2,101,54,0.25)]
                "
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <MapPin size={14} />
                  {r.city}
                </div>

                <p className="mt-3 italic">
                  “{r.text}”
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex text-[color:var(--brand-accent)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>

                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[color:var(--brand-primary)]/15 text-[color:var(--brand-accent)]">
                    {r.impact}
                  </span>
                </div>

                <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-3">
                  <p className="font-semibold text-sm">
                    {r.name}
                  </p>
                  <p className="text-xs text-muted">
                    {r.role}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="
        bg-white/75 dark:bg-black/45
        backdrop-blur-sm
        rounded-2xl
        p-5
        flex items-center gap-4
        transition-shadow duration-300
        hover:shadow-[0_14px_35px_rgba(2,101,54,0.25)]
      "
    >
      <div className="p-3 rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-bold">
          {value}
        </p>
        <p className="text-sm text-muted">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
