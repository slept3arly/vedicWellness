import Link from "next/link";
import { ShoppingBag, IndianRupee, ArrowRight } from "lucide-react";

const COLOR_MAP = {
  orders: {
    bg: "bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/40",
    iconBg: "bg-violet-100 dark:bg-violet-900/60",
    iconColor: "text-violet-600 dark:text-violet-400",
    labelCls: "text-violet-500 dark:text-violet-400",
    valueCls: "text-violet-900 dark:text-violet-100",
    arrowCls: "text-violet-400",
  },
  spent: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    labelCls: "text-emerald-500 dark:text-emerald-400",
    valueCls: "text-emerald-900 dark:text-emerald-100",
    arrowCls: "text-emerald-400",
  },
} as const;

type StatVariant = keyof typeof COLOR_MAP;

type Props = {
  variant: StatVariant;
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
};

const ICONS: Record<StatVariant, React.ReactNode> = {
  orders: <ShoppingBag className="w-5 h-5" />,
  spent: <IndianRupee className="w-5 h-5" />,
};

function Inner({ variant, label, value, sub, href }: Props) {
  const c = COLOR_MAP[variant];

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-5 py-4 w-full ${c.bg} ${
        href ? "active:scale-[0.98] transition-transform" : ""
      }`}
    >
      {/* Icon */}
      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${c.iconBg} ${c.iconColor}`}>
        {ICONS[variant]}
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0 flex-1">
        <p className={`text-[11px] font-bold uppercase tracking-widest ${c.labelCls}`}>{label}</p>
        <p className={`text-2xl font-bold tabular-nums tracking-tight mt-0.5 ${c.valueCls}`}>
          {value}
        </p>
        {sub && <p className={`text-xs mt-0.5 ${c.labelCls} opacity-80`}>{sub}</p>}
      </div>

      {/* Arrow — visual hint that this card is tappable */}
      {href && (
        <ArrowRight className={`w-4 h-4 shrink-0 ${c.arrowCls}`} />
      )}
    </div>
  );
}

export default function AccountStatsCard(props: Props) {
  if (props.href) {
    return (
      <Link href={props.href} className="block">
        <Inner {...props} />
      </Link>
    );
  }
  return <Inner {...props} />;
}