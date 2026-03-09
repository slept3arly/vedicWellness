import { ShoppingBag, IndianRupee } from "lucide-react";
import Card from "@/components/public/ui/Card";

type StatVariant = "orders" | "spent";

type Props = {
  variant: StatVariant;
  label: string;
  value: string | number;
};

const COLOR_MAP = {
  orders: {
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    labelCls: "text-violet-500/80 dark:text-violet-400/80",
    border: "border-violet-100 dark:border-violet-500/10",
  },
  spent: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    labelCls: "text-emerald-500/80 dark:text-emerald-400/80",
    border: "border-emerald-100 dark:border-emerald-500/10",
  },
} as const;

export default function AccountStatsCard({ variant, label, value }: Props) {
  const c = COLOR_MAP[variant];

  return (
    <Card className={`flex flex-col items-center justify-center p-4 sm:p-6 h-full text-center border-2 ${c.border} transition-all duration-300`}>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-sm ${c.iconBg} ${c.iconColor}`}>
        {variant === "orders" ? (
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </div>
      <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 ${c.labelCls}`}>
        {label}
      </p>
      <p className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums leading-none">
        {value}
      </p>
    </Card>
  );
}