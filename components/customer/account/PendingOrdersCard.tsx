import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

type Props = {
  count: number;
};

export default function PendingOrdersCard({ count }: Props) {
  if (!count) return null;

  return (
    <Link
      href="/orders"
      className="
        group flex items-center justify-between gap-4
        rounded-xl border border-amber-300 dark:border-amber-700
        bg-amber-100 dark:bg-amber-900
        hover:bg-amber-200 dark:hover:bg-amber-800
        px-4 py-3.5
        transition-colors
      "
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {count} pending {count === 1 ? "order" : "orders"} awaiting payment
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            Complete payment before they expire in 48h
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
        View Orders
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}