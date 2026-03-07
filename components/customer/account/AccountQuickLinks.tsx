import Link from "next/link";
import { ShoppingBag, ShoppingCart, User, Settings, ArrowRight } from "lucide-react";
import Card from "@/components/public/ui/Card";

type Props = {
  cartItemCount: number;
};

export default function AccountQuickLinks({ cartItemCount }: Props) {
  // Cart gets special treatment — wide rectangle on top-left
  // Others fill a 2-col asymmetric bento grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

      {/* ── Cart — spans 2 cols on mobile, 1 on sm+ ── */}
      <Link
        href="/cart"
        className="col-span-2 sm:col-span-2 group active:scale-[0.98] transition-transform"
      >
        <div className="relative flex items-center gap-4 rounded-2xl px-5 py-4 bg-brand-primary text-white shadow-md shadow-brand-primary/25 h-full">
          {/* Icon */}
          <div className="relative shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-brand-primary">
                {cartItemCount}
              </span>
            )}
          </div>

          {/* Label */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
              My Cart
            </span>
            <span className="text-white font-bold text-base leading-tight mt-0.5">
              {cartItemCount > 0
                ? `${cartItemCount} item${cartItemCount > 1 ? "s" : ""}`
                : "Empty"}
            </span>
          </div>

          {/* Arrow — always visible, clear tap hint */}
          <ArrowRight className="w-5 h-5 text-white/70 shrink-0" />
        </div>
      </Link>

      {/* ── Orders History ── */}
      <Link href="/orders" className="group active:scale-[0.98] transition-transform">
        <Card className="flex flex-col items-center justify-center gap-2.5 p-4 text-center h-full hover:border-brand-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
            <ShoppingBag className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-brand-primary transition-colors leading-tight">
            Orders
          </span>
        </Card>
      </Link>

      {/* ── My Profile ── */}
      <Link href="/account/profile" className="group active:scale-[0.98] transition-transform">
        <Card className="flex flex-col items-center justify-center gap-2.5 p-4 text-center h-full hover:border-brand-primary/30 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
            <User className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-brand-primary transition-colors leading-tight">
            Profile
          </span>
        </Card>
      </Link>

      {/* ── Settings — full width on mobile ── */}
      <Link href="/account/settings" className="col-span-2 sm:col-span-4 group active:scale-[0.98] transition-transform">
        <Card className="flex items-center gap-4 px-5 py-3.5 h-full hover:border-brand-primary/30 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-brand-primary transition-colors flex-1">
            Settings
          </span>
          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-brand-primary transition-colors shrink-0" />
        </Card>
      </Link>

    </div>
  );
}