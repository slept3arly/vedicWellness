import { Mail, CheckCircle2, MapPin } from "lucide-react";
import type { Address } from "@prisma/client";
import Card from "@/components/public/ui/Card";

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
    <Card className="flex flex-row items-center gap-4 px-5 py-4">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xl font-bold border-2 border-[var(--bg-main)] shadow-sm">
          {initials}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-full p-0.5">
          <CheckCircle2 className="w-3 h-3" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <h2 className="text-base font-bold text-[var(--text-main)] truncate">
          Hi, {localPart}!
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Mail className="w-3.5 h-3.5 shrink-0 text-brand-primary/70" />
            <p className="text-xs font-medium truncate">{email}</p>
          </div>
          {defaultAddress && (
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-primary/70" />
              <p className="text-xs font-medium truncate">
                {defaultAddress.city}, {defaultAddress.state}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}