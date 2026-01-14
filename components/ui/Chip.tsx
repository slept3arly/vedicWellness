import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Chip({ children, className = "" }: Props) {
  return (
    <span
      className={[
        "rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm text-slate-700 backdrop-blur",
        "dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
