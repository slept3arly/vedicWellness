type BadgeStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "CONVERTED"
  | "LOST"
  | "ADMIN"
  | "SALES"
  | "VIEWER"
  | "ACTIVE"
  | "INACTIVE";

const STYLE: Record<BadgeStatus, string> = {
  NEW: "bg-orange-500/15 text-orange-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-400",
  CONVERTED: "bg-green-500/15 text-green-400",
  LOST: "bg-red-500/15 text-red-400",

  ADMIN: "bg-purple-500/15 text-purple-400",
  SALES: "bg-yellow-500/15 text-yellow-400",
  VIEWER: "bg-neutral-500/15 text-neutral-300",

  ACTIVE: "bg-green-500/15 text-green-400",
  INACTIVE: "bg-neutral-500/15 text-neutral-400",
};

export default function AdminBadge({
  status,
  className = "",
}: {
  status: BadgeStatus;
  className?: string;
}) {
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${STYLE[status]} ${className}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
