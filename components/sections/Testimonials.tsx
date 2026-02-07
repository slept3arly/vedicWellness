"use client";

import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Briefcase,
  TrendingUp,
  Users,
} from "lucide-react";

import { fadeUpSoft, staggerFast, scaleIn } from "@/app/animations";
import { ReactNode } from "react";

type Review = {
  name: string;
  city: string;
  role: string;
  impact: string;
  text: string;
};

const reviews: Review[] = [
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

type StatProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-10"
      >
        <motion.div variants={fadeUpSoft}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Trusted by Growing Partners
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Real results from distributors and franchise owners across India.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Stat icon={<Users size={22} />} label="Active Partners" value="1,200+" />
          <Stat icon={<TrendingUp size={22} />} label="Average Growth" value="40%+" />
          <Stat icon={<Briefcase size={22} />} label="Cities Covered" value="85+" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <motion.div
              key={r.city}
              variants={scaleIn}
              initial="rest"
              animate="rest"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.7 }}
              className="
                rounded-2xl
                bg-white/70 dark:bg-slate-900/60
                p-6
                shadow-sm
                hover:shadow-lg
              "
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <MapPin size={14} />
                {r.city}
              </div>

              <p className="mt-3 italic text-slate-700 dark:text-slate-200">
                “{r.text}”
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex text-green-600 dark:text-green-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600/15 text-green-700 dark:text-green-300">
                  {r.impact}
                </span>
              </div>

              <div className="mt-4 border-t border-slate-200/60 dark:border-white/10 pt-3">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {r.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="rest"
      animate="rest"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 340, damping: 24, mass: 0.7 }}
      className="
        rounded-2xl
        bg-white/70 dark:bg-slate-900/60
        p-5
        shadow-sm
        flex items-center gap-4
        hover:shadow-lg
      "
    >
      <div className="p-3 rounded-xl bg-green-600/15 text-green-700 dark:text-green-300">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
