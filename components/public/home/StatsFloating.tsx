import { Pill, Layers, Users, Truck, BadgeCheck, Clock } from "lucide-react";
import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const stats = [
  {
    icon: Pill,
    value: "100+",
    label: "PCD Products",
    sub: "GMP Certified",
  },
  {
    icon: Layers,
    value: "15+",
    label: "Therapy Segments",
    sub: "High Demand",
  },
  {
    icon: Users,
    value: "250+",
    label: "Partners",
    sub: "Pan India Network",
  },
  {
    icon: Clock,
    value: "10+ Years",
    label: "Experience",
    sub: "Industry Expertise",
  },
  {
    icon: BadgeCheck,
    value: "ISO & GMP",
    label: "Certified",
    sub: "Quality Assured",
  },
  {
    icon: Truck,
    value: "PAN India 24*7",
    label: "Logistics",
    sub: "Fast Supply",
  },
];

export default function StatsGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 md:px-6 md:py-20">
      <div className="space-y-10">
        {/* Header */}
        <header className="text-center max-w-5xl mx-auto">
          <PageHeader
            title="Our Strength in Numbers"
            subtitle="A proven pharma partner built on quality, scale, and reliability."
          />
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {stats.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="group h-full">
              <Card className="bg-white/75 dark:bg-black/45 h-full flex flex-col justify-between p-4 md:p-6">

                {/* TOP */}
                <div className="flex flex-col gap-2 items-center text-center md:items-start md:text-left">

                  {/* VALUE */}
                  <p className="text-3xl md:text-4xl font-black leading-none tracking-tight">
                    {value}
                  </p>
                  <div className="flex flex-col items-center gap-1 md:flex-row md:items-center md:justify-between w-full">
                  {/* MICRO LABEL */}
                  <span className="font-accent text-[10px] md:text-xs font-semibold text-[color:var(--brand-accent)] uppercase tracking-wider">
                    {sub}
                  </span>

                  {/* ICON */}
                  <div className="text-[color:var(--brand-accent)] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={16} />
                  </div>
                  </div>

                </div>

                {/* BOTTOM */}
                <div className="mt-4 border-t border-foreground/10 pt-3 flex justify-center md:justify-start">
                  <p className="font-heading font-semibold text-sm md:text-base text-foreground text-center md:text-left">
                    {label}
                  </p>
                </div>

              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}