import {
  ClipboardList,
  BookOpen,
  MapPin,
  Rocket,
  Headphones,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const steps = [
  {
    icon: ClipboardList,
    title: "Apply for Franchise",
    desc: "Share your city or district along with basic business details to get started.",
    num: "01",
  },
  {
    icon: BookOpen,
    title: "Receive Catalog & Scheme",
    desc: "Get access to the complete product catalog, pricing, and distributor schemes.",
    num: "02",
  },
  {
    icon: MapPin,
    title: "Confirm Monopoly Rights",
    desc: "Finalize your exclusive area and complete onboarding with our team.",
    num: "03",
  },
  {
    icon: Rocket,
    title: "Start Selling & Grow",
    desc: "Begin distribution immediately with marketing and operational support.",
    num: "04",
  },
  {
    icon: Headphones,
    title: "Ongoing Partner Support",
    desc: "Dedicated support team available for queries, restocking, and business guidance.",
    num: "05",
  },
  {
    icon: TrendingUp,
    title: "Scale Your Territory",
    desc: "Expand into adjacent districts and unlock higher margin tiers as you grow.",
    num: "06",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <div className="space-y-12">
        <header className="text-center max-w-5xl mx-auto">
          <PageHeader
            title="How It Works"
            subtitle="A simple, transparent onboarding process designed for fast franchise activation."
          />
        </header>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {steps.map(({ icon: Icon, title, desc, num }) => (
            <div key={title} className="group">
              <Card className="bg-white/75 dark:bg-black/45 !p-0 overflow-hidden h-full">

                {/* ── MOBILE: vertical 2-col card ── */}
                <div className="flex flex-col h-full md:hidden">
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border-soft)] bg-[color:var(--brand-primary)]/5">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 px-4 py-3 flex-1">
                    <h3 className="font-heading font-semibold text-sm leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>

                {/* ── DESKTOP: horizontal strip ── */}
                <div className="hidden md:flex items-stretch gap-0">
                  <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 border-r border-[var(--border-soft)] min-w-[64px] bg-[color:var(--brand-primary)]/5 group-hover:bg-[color:var(--brand-primary)]/10 transition-colors duration-300">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)] transition-colors duration-300 group-hover:bg-[color:var(--brand-primary)]/35">
                      <Icon size={18} />
                    </div>
                    <span className="opacity-0 text-[10px]">{num}</span>
                  </div>
                  <div className="flex flex-col justify-center gap-1.5 px-5 py-5">
                    <h3 className="font-heading font-semibold text-base leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>

              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}