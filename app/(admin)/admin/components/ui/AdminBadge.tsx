import clsx from "clsx";

const styles: Record<string, string> = {
  NEW: "bg-yellow-500/10 text-yellow-400 border-yellow-400/30",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-400/30",
  CONVERTED: "bg-green-500/10 text-green-400 border-green-400/30",
  LOST: "bg-red-500/10 text-red-400 border-red-400/30",
};

type Props = {
  status: string;
  className?: string;
};

export default function AdminBadge({ status, className }: Props) {
  return (
    <span
      className={clsx(
        "text-xs px-3 py-1 rounded-full border font-medium",
        styles[status] ?? "border-neutral-700",
        className
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
