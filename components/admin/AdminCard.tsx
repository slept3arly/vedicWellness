import clsx from "clsx";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  index?: number; // New requirement: Card numbering
}

export default function AdminCard({
  className,
  compact = false,
  index,
  children,
  ...props
}: AdminCardProps) {
  return (
    <div
      {...props}
      className={clsx(
        `
        relative
        rounded-2xl
        border border-neutral-200
        bg-white text-neutral-900
        shadow-sm
        transition-all
        duration-200

        dark:border-neutral-800
        dark:bg-neutral-900
        dark:text-white
        `,
        compact ? "p-4 space-y-3" : "p-6 space-y-4",
        className
      )}
    >
      {/* Subtle indexing in the corner */}
      {index !== undefined && (
        <div className="absolute top-3 right-4 pointer-events-none select-none">
          <span className="text-[10px] font-black text-neutral-400/40 dark:text-neutral-500/40">
            #{index}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}