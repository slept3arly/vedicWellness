import { Star } from "lucide-react";
import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";

const reviews = [
  {
    name: "Distributor Partner",
    city: "Maharashtra",
    role: "Wholesale Distributor",
    impact: "+42% Revenue Growth",
    text: "Strong margins, reliable supply, and repeat demand helped us scale consistently.",
    textShort: "Strong margins and reliable supply helped us scale fast.",
  },
  {
    name: "Medical Representative",
    city: "Uttar Pradesh",
    role: "Field Sales",
    impact: "3x Doctor Engagement",
    text: "Quality products and marketing support made doctor conversions faster and easier.",
    textShort: "Quality products made doctor conversions easier.",
  },
  {
    name: "Franchise Owner",
    city: "Gujarat",
    role: "Regional Partner",
    impact: "+65% Monthly Orders",
    text: "Responsive support team and strong schemes helped us grow business quickly.",
    textShort: "Strong support and schemes helped us grow quickly.",
  },
  {
    name: "Retail Pharmacy Partner",
    city: "Tamil Nadu",
    role: "Pharmacy Chain Owner",
    impact: "+38% Sell-through Rate",
    text: "Product range fits market demand well and drives consistent repeat purchases.",
    textShort: "Products match demand and drive repeat purchases.",
  },
  {
    name: "Area Sales Manager",
    city: "Rajasthan",
    role: "Territory Manager",
    impact: "2x Territory Coverage",
    text: "Training and field support enabled faster expansion into new territories.",
    textShort: "Training enabled faster territory expansion.",
  },
  {
    name: "Hospital Supply Partner",
    city: "Karnataka",
    role: "Institutional Distributor",
    impact: "+55% Institutional Orders",
    text: "Timely delivery and consistent quality made us a preferred hospital supplier.",
    textShort: "Timely delivery and quality made us a preferred supplier.",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20">
      <div className="space-y-12">
        {/* Header */}
        <header className="text-center max-w-5xl mx-auto">
          <PageHeader
            title="Trusted by Growing Partners"
            subtitle="Real results from franchise owners across India."
          />
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((r) => (
            <div key={r.city} className="group h-full">
              <Card className="bg-white/75 dark:bg-black/45 h-full flex flex-col justify-between p-3 md:p-5">

                {/* TOP */}
                <div>
                  <p className="italic text-xs md:text-lg leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3 md:line-clamp-none min-h-[3.8rem] md:min-h-0">
                    
                    {/* Mobile short text */}
                    <span className="md:hidden">&quot;{r.textShort}&quot;</span>

                    {/* Desktop full text */}
                    <span className="hidden md:inline">&quot;{r.text}&quot;</span>

                  </p>

                  <div className="mt-2 md:mt-4 flex justify-between items-center">
                    
                    {/* Impact */}
                    <span className="font-accent text-[10px] md:text-xs font-semibold text-[color:var(--brand-accent)] uppercase tracking-wider">
                      {r.impact}
                    </span>

                    {/* Stars */}
                    <div className="flex text-[color:var(--brand-accent)] transition-transform duration-300 group-hover:scale-105">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="md:w-[14px] md:h-[14px]"
                          fill="currentColor"
                        />
                      ))}
                    </div>

                  </div>
                </div>

                {/* BOTTOM */}
                <div className="mt-3 md:mt-6 border-t border-foreground/10 pt-2 md:pt-4">
                  
                  {/* Name */}
                  <p className="font-heading font-semibold text-xs md:text-base text-foreground">
                    {r.name}
                  </p>

                  {/* Role + City */}
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-0.5 md:mt-1">
                    {r.role} • {r.city}
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
