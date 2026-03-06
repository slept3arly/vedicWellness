import { Mail, CheckCircle2, MapPin } from "lucide-react";
import type { Address } from "@prisma/client";

type Props = {
  email: string;
  defaultAddress?: Pick<Address, "city" | "state"> | null;
};

export default function AccountProfileCard({ email, defaultAddress }: Props) {
  const localPart = email.split("@")[0];
  const initials =
    localPart
      .split(/[._-]/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") ||
    localPart[0]?.toUpperCase() ||
    "U";

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4 flex items-center gap-4 h-full">
      <div className="shrink-0 w-11 h-11 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center text-white text-base font-bold">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Verified
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
          <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
          <p className="text-sm font-medium text-[var(--text-main)] truncate">
            {email}
          </p>
        </div>
        {defaultAddress && (
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
            <p className="text-xs text-[var(--text-muted)] truncate">
              Ships to {defaultAddress.city}, {defaultAddress.state}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}