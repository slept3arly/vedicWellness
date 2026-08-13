import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

type SeoLinkProps = ComponentProps<typeof Link>;

export default function SeoLink({ className, ...props }: SeoLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "font-semibold text-brand-accent",
        "hover:underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)]/50",
        className
      )}
    />
  );
}
