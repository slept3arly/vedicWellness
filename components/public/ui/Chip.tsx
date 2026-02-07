type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Chip({ children, className = "" }: Props) {
  return (
    <span
      className={`
        inline-flex items-center
        px-4 py-2 text-sm
        rounded-full
        bg-[var(--bg-surface)]
        border border-[var(--border-soft)]
        text-[var(--text-main)]
        ${className}
      `}
    >
      {children}
    </span>
  );
}
