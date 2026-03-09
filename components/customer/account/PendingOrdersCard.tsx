import Link from "next/link";
import { Clock, ArrowRight, AlertCircle } from "lucide-react";
import Card from "@/components/public/ui/Card";

type Props = {
  count: number;
};

export default function PendingOrdersCard({ count }: Props) {
  const isEmpty = count === 0;

  return (
    <Link
      href={isEmpty ? "#" : "/orders?status=CREATED"}
      className={`block group transition-all duration-300 ${
        isEmpty ? "pointer-events-none opacity-70" : "active:scale-[0.99]"
      }`}
    >
      <Card className={`relative overflow-hidden p-0 transition-colors ${
        isEmpty 
          ? "border-zinc-100 dark:border-zinc-800" 
          : "border-amber-100 dark:border-amber-500/20"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
          
          {/* Visual Indicator */}
          <div className="flex items-center gap-4 flex-1">
            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105 ${
              isEmpty 
                ? "bg-zinc-50 text-zinc-400 dark:bg-zinc-800" 
                : "bg-amber-50 text-amber-600 dark:bg-amber-500/10"
            }`}>
              <Clock className={`w-6 h-6 ${!isEmpty ? "animate-pulse" : ""}`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  isEmpty ? "text-zinc-400" : "text-amber-600"
                }`}>
                  {isEmpty ? "Payments" : "Action Required"}
                </span>
                {!isEmpty && <AlertCircle className="w-3 h-3 text-amber-500" />}
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base truncate">
                {isEmpty ? "All caught up" : `${count} Pending Payments`}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                {isEmpty ? "No orders awaiting checkout" : "Complete checkout to avoid expiry"}
              </p>
            </div>
          </div>

          {/* Action Area */}
          {!isEmpty && (
            <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
              <div className="sm:text-right">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Status</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase">
                  Pay Now
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}