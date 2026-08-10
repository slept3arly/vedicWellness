import Link from "next/link";
import { Package, ArrowRight, CheckCircle2 } from "lucide-react";
import Card from "@/components/public/ui/Card";

type Props = {
  order: {
    id: string;
    totalAmount: number;
    createdAt: Date;
    firstProductName: string | null;
    itemCount: number;
  } | null;
};

export default function LastOrderBanner({ order }: Props) {
  const isEmpty = !order;

  return (
    <Link 
      href={isEmpty ? "#" : `/orders/${order.id}`}
      className={`block group transition-all duration-300 ${isEmpty ? "pointer-events-none opacity-70" : "active:scale-[0.99]"}`}
    >
      <Card className="relative overflow-hidden p-0 border-sky-100 dark:border-sky-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
          
          {/* Visual Indicator */}
          <div className="flex items-center gap-4 flex-1">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 shadow-inner">
              <Package className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                  {isEmpty ? "Member Status" : "Last Order"}
                </span>
                {!isEmpty && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base truncate">
                {isEmpty ? "Welcome to Vedic Wellness" : order.firstProductName || "Wellness Package"}
              </h3>
              {!isEmpty && (
                <p className="text-xs text-zinc-500 font-medium">
                  Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Action */}
          {!isEmpty && (
            <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
              <div className="sm:text-right">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Order Value</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
                  ₹{order.totalAmount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
