import clsx from "clsx";

export default function AdminCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur p-4",
        className
      )}
      {...props}
    />
  );
}
