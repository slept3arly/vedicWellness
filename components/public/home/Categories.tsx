import { ShieldPlus, Leaf, Droplet, Sparkles, Flame, HeartPulse } from "lucide-react";
import Link from "next/link";

import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const categories = [
  { title: "Immunity Care", count: "30+ Products", icon: ShieldPlus, num: "01" },
  { title: "Digestive Range", count: "25+ Products", icon: Leaf, num: "02" },
  { title: "Liver Care", count: "15+ Products", icon: Droplet, num: "03" },
  { title: "Skin & Hair", count: "20+ Products", icon: Sparkles, num: "04" },
  { title: "Pain Relief Oils", count: "10+ Products", icon: Flame, num: "05" },
  { title: "General Wellness", count: "40+ Products", icon: HeartPulse, num: "06" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <div className="space-y-12">
        <header className="text-center max-w-5xl mx-auto">
          <PageHeader
            title="Product Categories"
            subtitle="High-demand Ayurvedic ranges designed to drive repeat sales and long-term franchise growth."
          />
        </header>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {categories.map(({ title, count, icon: Icon, num }) => (
            <Link
              key={title}
              href="/products"
              className="group"
            >
              <Card className="bg-white/75 dark:bg-black/45 !p-0 overflow-hidden h-full">

                {/* ── MOBILE: vertical 2-col card ── */}
                <div className="flex flex-col h-full md:hidden">
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border-soft)] bg-[color:var(--brand-primary)]/5">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)]">
                      <Icon size={15} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-3 flex-1">
                    <h3 className="font-heading font-semibold text-sm leading-snug">{title}</h3>
                    <p className="text-xs text-muted">{count}</p>
                    <span className="inline-flex items-center gap-1 pt-2 text-xs font-semibold text-[color:var(--brand-accent)]">
                      Explore
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>

                {/* ── DESKTOP: horizontal strip ── */}
                <div className="hidden md:flex items-stretch">
                  <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 border-r border-[var(--border-soft)] min-w-[64px] bg-[color:var(--brand-primary)]/5 group-hover:bg-[color:var(--brand-primary)]/10 transition-colors duration-300">
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--brand-accent)] opacity-60">
                      {num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-primary)]/20 text-[color:var(--brand-accent)] transition-colors duration-300 group-hover:bg-[color:var(--brand-primary)]/35">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="opacity-0 text-[10px]">{num}</span>
                  </div>
                  <div className="flex flex-col justify-center gap-1.5 px-5 py-5">
                    <h3 className="font-heading font-semibold text-base leading-snug">{title}</h3>
                    <p className="text-sm text-muted">{count}</p>
                    <span className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-[color:var(--brand-accent)]">
                      Explore
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>

              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}