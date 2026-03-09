import { Mail, CheckCircle2, MapPin } from "lucide-react";
import type { Address } from "@prisma/client";
import Card from "@/components/public/ui/Card";

type Props = {
  email: string;
  defaultAddress?: Pick<Address, "city" | "state"> | null;
};

export default function AccountProfileCard({ email, defaultAddress }: Props) {
  const localPart = email.split("@")[0];
  const initials = localPart.slice(0, 2).toUpperCase();

  return (
    <Card className="relative overflow-hidden p-0 h-full border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-8 w-full max-w-2xl mx-auto">
        
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 shadow-inner">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 sm:p-1.5 shadow-md border-2 border-white dark:border-zinc-900">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] block mb-1 sm:mb-2">Verified Profile</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none truncate mb-2 sm:mb-4">
            Hi, {localPart}!
          </h2>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1.5 justify-center sm:justify-start">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Mail className="w-3.5 h-3.5 opacity-60" />
              <span className="text-xs font-medium truncate">{email}</span>
            </div>
            {defaultAddress && (
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 opacity-60" />
                <span className="text-xs font-medium">
                  {defaultAddress.city}, {defaultAddress.state}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}