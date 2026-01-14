import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 bg-white/60 shadow-xl backdrop-blur",
        "dark:border-slate-800 dark:bg-slate-900/40",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
