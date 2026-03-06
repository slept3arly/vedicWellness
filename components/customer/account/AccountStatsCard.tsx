import Link from "next/link";

type Props = {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
};

function Inner({ icon, label, value, sub }: Omit<Props, "href">) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 flex flex-col items-center justify-center text-center gap-0.5 h-full transition-colors group-hover:border-[var(--text-muted)]/30">
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-1">
          {icon}
        </div>
      )}
      <p className="text-lg font-bold text-[var(--text-main)] tabular-nums leading-none">
        {value}
      </p>
      <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">
        {label}
      </p>
      {sub && (
        <p className="text-xs text-[var(--text-muted)] opacity-60">{sub}</p>
      )}
    </div>
  );
}

export default function AccountStatsCard({ href, ...props }: Props) {
  if (href) {
    return (
      <Link href={href} className="group block h-full">
        <Inner {...props} />
      </Link>
    );
  }
  return <Inner {...props} />;
}