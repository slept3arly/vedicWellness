import { Hash, Calendar } from "lucide-react";

type Props = {
  orderId: string;
  currency: string;
  createdAt: Date | string;
};

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[var(--border-soft)] last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-[var(--text-muted)] shrink-0">{icon}</span>
        <span className="text-xs text-[var(--text-muted)]">{label}</span>
      </div>
      <span className="text-xs font-medium text-[var(--text-main)] text-right truncate max-w-[60%] font-mono">
        {value}
      </span>
    </div>
  );
}

export default function OrderMetaCard({ orderId, currency, createdAt }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-soft)]">
        <Hash className="w-4 h-4 text-[var(--text-muted)]" />
        <p className="text-sm font-semibold text-[var(--text-main)]">Order info</p>
      </div>

      <div className="px-4">
        <Row
          icon={<Hash className="w-3.5 h-3.5" />}
          label="Order ID"
          value={orderId.slice(-12).toUpperCase()}
        />
        <Row
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Placed"
          value={formatDateTime(createdAt)}
        />
        <Row
          icon={<Hash className="w-3.5 h-3.5" />}
          label="Currency"
          value={currency || "INR"}
        />
      </div>
    </div>
  );
}
