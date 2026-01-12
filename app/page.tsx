"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  MapPin,
  Banknote,
  Presentation,
  PhoneCall,
  MessagesSquare,
  PackageCheck,
  Layers,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <Hero />

      {/* TRUST ROW */}
      <TrustRow />

      {/* STATS */}
      <StatsStrip />

      {/* PRODUCT CATEGORIES */}
      <ProductCategories />

      {/* FRANCHISE BENEFITS */}
      <FranchiseBenefits />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CTA BANNER */}
      <CTABanner />
    </div>
  );
}

/* ---------------------------- HERO (Option A) ---------------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Your global blobs are already running via GlobalBackground,
          but adding gentle hero-only gradient gives premium feel */}
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <p className="inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
                <Sparkles size={16} />
                PCD Pharma Franchise • Ayurvedic Range
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-5xl"
            >
              Grow your pharma business with{" "}
              <span className="text-green-600 dark:text-green-400">
                Vedic Wellness
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-xl font-body text-lg text-slate-700 dark:text-slate-300"
            >
              Vedic Wellness (A Division of Innovia Drugs) offers a strong Ayurvedic
              portfolio for PCD partners — monopoly rights, marketing support,
              fast dispatch and high-demand products.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#apply"
                className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                Apply for Franchise
              </a>

              <div className="flex gap-3">
                <a
                  href="tel:+910000000000"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white hover:text-black dark:border-slate-800 dark:bg-slate-900/40 dark:text-white"
                >
                  <PhoneCall size={18} />
                  Call
                </a>
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-green-600/25 bg-green-500/10 px-5 py-3 font-semibold text-green-800 shadow-sm transition hover:bg-green-500/15 dark:text-green-200"
                >
                  <MessagesSquare size={18} />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* MICRO TRUST */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {[
                "ISO Certified",
                "District Monopoly",
                "High Profit Margin",
                "Fast Dispatch",
                "Promotional Support",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            {/* PLAYFAIR BRAND LINE */}
            <motion.p
              variants={fadeUp}
              className="font-quote text-lg italic text-slate-700 dark:text-slate-300"
            >
              Innovating Ayurveda, Preserving Tradition
            </motion.p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
              <div className="grid gap-4">
                <HeroCard
                  icon={BadgeCheck}
                  title="WHO-GMP Quality Products"
                  desc="Manufacturing & quality standards designed for consistent performance."
                />
                <HeroCard
                  icon={MapPin}
                  title="Monopoly Rights Available"
                  desc="Exclusive franchise rights for your city/district to ensure growth."
                />
                <HeroCard
                  icon={Truck}
                  title="Fast Dispatch & Supply"
                  desc="Reliable stock availability with quick dispatch support."
                />
              </div>

              {/* Offer card */}
              <div
                id="apply"
                className="mt-6 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 p-5 text-white"
              >
                <p className="text-sm opacity-90">Limited openings available</p>
                <p className="mt-1 text-xl font-extrabold">
                  Get Product List + Franchise Offer
                </p>
                <p className="mt-1 text-sm opacity-90">
                  Receive the latest schemes & product catalog within 24 hours.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/15 px-4 py-3 text-sm">
                    ✅ Marketing Kit
                  </div>
                  <div className="rounded-xl bg-white/15 px-4 py-3 text-sm">
                    ✅ Visual Aids Support
                  </div>
                </div>
              </div>
            </div>

            {/* floating badge */}
            <div className="pointer-events-none absolute -top-4 -right-4 hidden rounded-2xl border border-green-600/25 bg-white/70 px-4 py-3 text-sm font-semibold text-green-800 shadow-lg backdrop-blur dark:bg-slate-900/40 dark:text-green-200 lg:block">
              Trusted Ayurvedic Franchise
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
          <Icon size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="font-body text-sm text-slate-600 dark:text-slate-300">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- TRUST ROW ------------------------------ */
function TrustRow() {
  const items = [
    { icon: ShieldCheck, label: "Quality Assured" },
    { icon: BadgeCheck, label: "ISO Certified" },
    { icon: PackageCheck, label: "Ayurvedic Range" },
    { icon: Truck, label: "Fast Dispatch" },
    { icon: Presentation, label: "Marketing Support" },
    { icon: MapPin, label: "Monopoly Rights" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className="-mt-2 rounded-3xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
            >
              <Icon size={16} className="text-green-600 dark:text-green-400" />
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------- STATS STRIP ---------------------------- */
function StatsStrip() {
  const stats = [
    { value: "200+", label: "Products" },
    { value: "15+", label: "Categories" },
    { value: "500+", label: "Distributors" },
    { value: "PAN India", label: "Delivery" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 rounded-3xl border border-slate-200 bg-white/60 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="rounded-2xl bg-white/70 p-6 shadow-sm dark:bg-slate-950/40"
          >
            <p className="font-heading text-3xl font-extrabold text-green-600 dark:text-green-400">
              {s.value}
            </p>
            <p className="mt-1 font-body text-sm text-slate-600 dark:text-slate-300">
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------------------- PRODUCT CATEGORIES ------------------------ */
function ProductCategories() {
  // Replace these with categories from your product page later.
  const categories = [
    { title: "Immunity Care", count: "30+ Products" },
    { title: "Digestive Range", count: "25+ Products" },
    { title: "Liver Care", count: "15+ Products" },
    { title: "Skin & Hair", count: "20+ Products" },
    { title: "Pain Relief Oils", count: "10+ Products" },
    { title: "General Wellness", count: "40+ Products" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-10"
      >
        <motion.div variants={fadeUp} className="space-y-2">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Product Categories
          </h2>
          <p className="max-w-2xl font-body text-slate-600 dark:text-slate-300">
            Explore high-demand Ayurvedic categories designed for strong sales and
            repeat purchase.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <motion.a
              key={c.title}
              variants={fadeUp}
              href="/products"
              className="group rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                <Layers size={20} />
              </div>

              <h3 className="font-heading text-lg font-bold">{c.title}</h3>
              <p className="mt-2 font-body text-sm text-slate-600 dark:text-slate-300">
                {c.count}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold text-green-700 dark:text-green-300">
                Explore <span className="transition group-hover:translate-x-1">→</span>
              </p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------------------- FRANCHISE BENEFITS ------------------------ */
function FranchiseBenefits() {
  const benefits = [
    "District / City Monopoly Rights",
    "High Profit Margins",
    "Low Investment PCD Model",
    "Regular Stock Availability",
    "Promotional Material Support",
    "New Launch Updates & Schemes",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl font-extrabold"
          >
            Franchise Benefits
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-slate-600 dark:text-slate-300">
            We help you scale with monopoly rights, consistent supply, and strong
            support — so you can focus on sales and expansion.
          </motion.p>

          <motion.ul variants={stagger} className="space-y-3">
            {benefits.map((b) => (
              <motion.li
                key={b}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/60 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/40"
              >
                <CheckCircle2 className="mt-0.5 text-green-600 dark:text-green-400" size={20} />
                <span className="font-body text-slate-700 dark:text-slate-200">{b}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right offer card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-slate-200 bg-white/60 p-8 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
              <Banknote size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Franchise Opportunity
              </p>
              <p className="font-heading text-xl font-extrabold">
                Grow with a trusted Ayurvedic brand
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                ✅ Marketing Support
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Visual aids, banners & product literature.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                ✅ Reliable Supply
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Fast dispatch + consistent stock availability.
              </p>
            </div>
          </div>

          <a
            href="#apply"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
          >
            Get Franchise Details
          </a>

          <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Response time: typically within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ HOW IT WORKS ---------------------------- */
function HowItWorks() {
  const steps = [
    {
      title: "Apply for Franchise",
      desc: "Share your city/district and business details to get started.",
    },
    {
      title: "Receive Catalog & Scheme",
      desc: "We send product list, price list, and current schemes quickly.",
    },
    {
      title: "Confirm Monopoly Rights",
      desc: "Finalize area monopoly and complete onboarding documentation.",
    },
    {
      title: "Start Selling & Grow",
      desc: "Get support materials and start distribution immediately.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-10"
      >
        <motion.div variants={fadeUp} className="space-y-2">
          <h2 className="font-heading text-3xl font-extrabold">How It Works</h2>
          <p className="max-w-2xl font-body text-slate-600 dark:text-slate-300">
            Simple onboarding process designed for fast franchise activation.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="absolute -top-8 -right-6 font-heading text-8xl font-extrabold text-green-600/10 dark:text-green-400/10">
                {idx + 1}
              </div>

              <h3 className="font-heading text-lg font-bold">{s.title}</h3>
              <p className="mt-2 font-body text-sm text-slate-600 dark:text-slate-300">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------ TESTIMONIALS ---------------------------- */
function Testimonials() {
  const list = [
    {
      name: "Distributor Partner",
      city: "Maharashtra",
      quote:
        "Excellent margins and fast dispatch. Monopoly rights gave us strong growth in our area.",
    },
    {
      name: "Medical Representative",
      city: "Uttar Pradesh",
      quote:
        "Marketing support and product literature helped us convert doctors faster and build trust.",
    },
    {
      name: "PCD Franchise Owner",
      city: "Gujarat",
      quote:
        "Quality products with repeat demand. Support team is responsive and schemes are attractive.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-10"
      >
        <motion.div variants={fadeUp} className="space-y-2">
          <h2 className="font-heading text-3xl font-extrabold">Testimonials</h2>
          <p className="max-w-2xl font-body text-slate-600 dark:text-slate-300">
            Trusted by partners and distributors across India.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {list.map((t) => (
            <motion.div
              key={t.city}
              variants={fadeUp}
              className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/15 font-heading font-extrabold text-green-700 dark:text-green-300">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-heading text-sm font-bold">{t.name}</p>
                  <p className="font-body text-xs text-slate-600 dark:text-slate-300">
                    {t.city}
                  </p>
                </div>
              </div>

              <p className="mt-4 font-quote text-base italic text-slate-700 dark:text-slate-200">
                “{t.quote}”
              </p>

              <div className="mt-4 flex gap-1 text-green-600 dark:text-green-400">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------- CTA BANNER ----------------------------- */
function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-3xl bg-gradient-to-r from-green-600 to-green-500 p-8 text-white shadow-xl"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-extrabold">
              Ready to start your PCD franchise journey?
            </h2>
            <p className="font-body text-white/90">
              Get product list, latest schemes, and monopoly availability details within 24 hours.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-green-700 shadow-sm transition hover:bg-white/90"
            >
              Apply Now
            </a>
            <a
              href="https://wa.me/917206867795"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <MessagesSquare size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
