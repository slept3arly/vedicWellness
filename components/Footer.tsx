import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { cn } from "@/lib/cn";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-4 py-14 md:px-6 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold">Vedic Wellness</h3>
          <p className="text-sm text-muted">
            A trusted Ayurvedic PCD Pharma Franchise offering WHO-GMP certified
            formulations and monopoly rights.
          </p>

          <div className="flex gap-3 pt-2">
            <SocialLink href="https://www.facebook.com/vedicwellnessid/" icon={Facebook} />
            <SocialLink href="https://www.instagram.com/vedic.wellness.official" icon={Instagram} />
            <SocialLink href="https://wa.me/+919306025799" icon={MessageCircle} />
          </div>
        </div>

        <FooterColumn title="Company">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/products">Products</FooterLink>
          <FooterLink href="/blogs">Blogs</FooterLink>
        </FooterColumn>

        <FooterColumn title="Franchise">
          <FooterLink href="/contact">Apply</FooterLink>
          <FooterLink href="/products">Catalogue</FooterLink>
          <FooterLink href="/about">Why Us</FooterLink>
        </FooterColumn>

        <FooterColumn title="Contact">
          <div className="space-y-3 text-sm text-muted">
            <div className="flex gap-2">
              <MapPin size={16} />
              <span>Division of Innovia Drugs, India</span>
            </div>
            <div className="flex gap-2">
              <Phone size={16} />
              <a href="tel:+919306025799">+91 93060 25799</a>
            </div>
            <div className="flex gap-2">
              <Mail size={16} />
              <a href="mailto:vedicwellnessid@gmail.com">
                vedicwellnessid@gmail.com
              </a>
            </div>
          </div>
        </FooterColumn>
      </div>

      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between text-xs text-muted">
          <p>© {CURRENT_YEAR} Vedic Wellness. All rights reserved.</p>
          <div className="flex gap-4">
            <FooterLink href="/privacy-policy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: any) {
  return (
    <Link href={href} className="text-sm text-muted hover:text-accent">
      {children}
    </Link>
  );
}

function SocialLink({ href, icon: Icon }: any) {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        "h-9 w-9 flex items-center justify-center rounded-full",
        "bg-primary/10 text-accent hover:bg-primary/20"
      )}
    >
      <Icon size={16} />
    </a>
  );
}
