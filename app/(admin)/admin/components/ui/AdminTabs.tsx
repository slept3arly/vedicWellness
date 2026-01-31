"use client";

import Link from "next/link";

type Tab = {
  label: string;
  value: string;
};

export default function AdminTabs({
  tabs = [],
  active = "",
}: {
  tabs?: Tab[];
  active?: string;
}) {
  if (!tabs.length) return null;

  return (
    <div className="flex gap-2 border-b border-border pb-3">
      {tabs.map((tab) => {
        const isActive = tab.value === active;

        return (
          <Link
            key={tab.value}
            href={`?tab=${tab.value}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted hover:bg-muted/70 text-muted-foreground"
              }
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
