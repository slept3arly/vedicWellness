"use client";

type Order = {
  id: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
};

type DayBar = {
  label: string;
  paid: number;
  pending: number;
  failed: number;
};

type Props = {
  orders: Order[];
};

function getLast14Days(): { date: Date; label: string }[] {
  const days = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const label = d
      .toLocaleDateString("en-IN", { weekday: "short" })
      .slice(0, 2);

    days.push({ date: d, label });
  }

  return days;
}

function buildBars(orders: Order[]): DayBar[] {
  return getLast14Days().map(({ date, label }) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);

    const day = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= date && d < next;
    });

    return {
      label,
      paid: day.filter((o) => o.status === "PAID").length,
      pending: day.filter((o) => o.status === "CREATED").length,
      failed: day.filter(
        (o) => o.status === "PAYMENT_FAILED" || o.status === "EXPIRED"
      ).length,
    };
  });
}

const CHART_HEIGHT = 120;

export default function AccountActivityChart({ orders }: Props) {
  const bars = buildBars(orders);

  const max = Math.max(
    ...bars.map((b) => b.paid + b.pending + b.failed),
    1
  );

  const ySteps = 4;
  const stepValue = Math.ceil(max / ySteps);

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)]">
            Order Activity
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Last 14 days
          </p>
        </div>
      </div>

      <div className="flex gap-3">

        {/* Y AXIS */}
        <div
          className="flex flex-col justify-between text-[10px] text-[var(--text-muted)] pr-2"
          style={{ height: CHART_HEIGHT }}
        >
          {Array.from({ length: ySteps + 1 }).map((_, i) => {
            const value = stepValue * (ySteps - i);
            return <span key={i}>{value}</span>;
          })}
        </div>

        {/* CHART AREA */}
        <div className="flex-1 relative">

          {/* GRID LINES */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: ySteps + 1 }).map((_, i) => (
              <div
                key={i}
                className="border-t border-[var(--border-soft)] opacity-60"
              />
            ))}
          </div>

          {/* BARS */}
          <div
            className="relative flex items-end gap-2"
            style={{ height: CHART_HEIGHT }}
          >
            {bars.map((bar, i) => {
              const total = bar.paid + bar.pending + bar.failed;

              const paidH = (bar.paid / max) * CHART_HEIGHT;
              const pendH = (bar.pending / max) * CHART_HEIGHT;
              const failH = (bar.failed / max) * CHART_HEIGHT;

              return (
                <div key={i} className="flex-1 flex flex-col items-center">

                  {/* total label */}
                  {total > 0 && (
                    <span className="text-[10px] text-[var(--text-muted)] mb-1">
                      {total}
                    </span>
                  )}

                  <div className="w-full flex flex-col justify-end rounded-sm overflow-hidden">

                    {failH > 0 && (
                      <div
                        className="bg-red-400"
                        style={{ height: failH }}
                      />
                    )}

                    {pendH > 0 && (
                      <div
                        className="bg-amber-400"
                        style={{ height: pendH }}
                      />
                    )}

                    {paidH > 0 && (
                      <div
                        className="bg-emerald-500"
                        style={{ height: paidH }}
                      />
                    )}

                    {total === 0 && (
                      <div className="h-[2px] w-full bg-[var(--border-soft)] opacity-40" />
                    )}
                  </div>

                  {/* X label */}
                  <span className="text-[10px] text-[var(--text-muted)] mt-2">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-sm" />
          Paid
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-400 rounded-sm" />
          Pending
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-400 rounded-sm" />
          Failed
        </div>
      </div>
    </div>
  );
}