type Props = {
  children: React.ReactNode;
  tone?: "brand" | "neutral";
};

export default function Badge({ children, tone = "brand" }: Props) {
  return (
    <span
      className={`
        
        inline-flex items-center gap-1
        px-4 py-1.5 text-xs font-medium
        rounded-full border backdrop-blur
        ${
          tone === "brand"
            ? "bg-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_25%,transparent)]"
            : "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-soft)]"
        }
      `}
    >
      {children}
    </span>
  );
}
