import clsx from "clsx";

export default function AdminCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        `
        rounded-2xl
        border border-neutral-200
        bg-white text-neutral-900
        shadow-sm

        dark:border-neutral-800
        dark:bg-neutral-900
        dark:text-white

        p-6 space-y-4
        `,
        className
      )}
    />
  );
}
