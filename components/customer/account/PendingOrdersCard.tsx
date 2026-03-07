import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

type Props = {
  count: number;
};

export default function PendingOrdersCard({ count }: Props) {
  if (!count) return null;

  return (
    <Link href="/orders" className="group block active:scale-[0.98] transition-transform">
      <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300/60 dark:border-amber-700/40 shadow-sm shadow-amber-100 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
              {count} pending {count === 1 ? "order" : "orders"} awaiting payment
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
              Complete payment before they expire in 48h
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">
          View
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}