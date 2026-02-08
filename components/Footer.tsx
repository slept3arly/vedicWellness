"use client";

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

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-surface)]">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 py-14 md:px-6 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Vedic Wellness
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            A trusted Ayurvedic PCD Pharma Franchise offering WHO-GMP certified
            formulations, monopoly rights, and long-term business growth.
          </p>

          {/* Social */}
          <div className="flex items-center gap-3 pt-2">
            <SocialLink href="https://www.facebook.com/vedicwellnessid/" icon={Facebook} />
            <SocialLink href="https://www.instagram.com/vedic.wellness.official" icon={Instagram} />
            <SocialLink href="https://wa.me/+919306025799" icon={MessageCircle} />
          </div>
        </div>

        {/* Quick Links */}
        <FooterColumn title="Company">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/products">Products</FooterLink>
          <FooterLink href="/blogs">Blogs</FooterLink>
        </FooterColumn>

        {/* Franchise */}
        <FooterColumn title="Franchise">
          <FooterLink href="/contact">Apply for Franchise</FooterLink>
          <FooterLink href="/products">Product Catalogue</FooterLink>
          <FooterLink href="/about">Why Choose Us</FooterLink>
        </FooterColumn>

        {/* Contact */}
        <FooterColumn title="Contact">
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-[color:var(--brand-accent)]" />
              <span>
                Division of Innovia Drugs, <br />
                India
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[color:var(--brand-accent)]" />
              <a href="tel:+919306025799" className="hover:underline">
                +91 93060 25799
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[color:var(--brand-accent)]" />
              <a
                href="mailto:info@vedicwellness.in"
                className="hover:underline"
              >
                vedicwellnessid@gmail.com
              </a>
            </div>
          </div>
        </FooterColumn>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--border-soft)]">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-muted">
          <p>
            © {new Date().getFullYear()} Vedic Wellness. All rights reserved.
          </p>

          <div className="flex gap-4">
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms & Conditions</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted hover:text-[color:var(--brand-accent)] transition"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  icon: Icon,
}: {
  href: string;
  icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full",
        "bg-[color:var(--brand-primary)]/10",
        "text-[color:var(--brand-accent)]",
        "hover:bg-[color:var(--brand-primary)]/20 transition"
      )}
    >
      <Icon size={16} />
    </a>
  );
}
