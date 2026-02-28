import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { memo } from "react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="border-t border-[var(--border-soft)] bg-[var(--bg-surface)]"
    >
      <div
        className="
        max-w-7xl mx-auto px-4 py-14 md:px-6
        grid gap-10
        grid-cols-2
        md:grid-cols-[1.2fr_1fr_1fr_1fr]
      "
      >
        {/* BRAND COLUMN */}
        <div className="col-span-2 md:col-span-1 space-y-6 md:border-r md:pr-10 text-center md:text-left">
          {/* LOGO */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo.svg"
              alt="Vedic Wellness Logo"
              width={220}
              height={80}
              loading="lazy"
              className="
                w-[140px]
                md:w-auto md:max-w-[200px]
                h-auto
                md:brightness-110 md:contrast-110
              "
            />
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-muted/90 leading-relaxed max-w-sm mx-auto md:mx-0">
            Vedic Wellness is a GMP certified Ayurvedic PCD Pharma company
            delivering high-quality herbal formulations, ethical franchise
            opportunities, and long-term business growth across India.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 justify-center md:justify-start pt-2">
            <SocialLink
              href="https://www.facebook.com/vedicwellnessid/"
              icon={Facebook}
              label="Facebook"
              className="bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20"
            />
            <SocialLink
              href="https://www.instagram.com/vedic.wellness.official"
              icon={Instagram}
              label="Instagram"
              className="bg-pink-500/10 text-pink-600 hover:bg-pink-500/20"
            />
            <SocialLink
              href="https://wa.me/+919306025799"
              icon={MessageCircle}
              label="WhatsApp"
              className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
            />
          </div>
        </div>

        {/* COMPANY */}
        <FooterColumn title="Company Information">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About Vedic Wellness</FooterLink>
          <FooterLink href="/products">Product Portfolio</FooterLink>
          <FooterLink href="/blogs">Knowledge Center</FooterLink>
        </FooterColumn>

        {/* FRANCHISE */}
        <FooterColumn title="Franchise Opportunities">
          <FooterLink href="/contact">Apply for Franchise</FooterLink>
          <FooterLink href="/products">Download Catalogue</FooterLink>
          <FooterLink href="/about">Why Partner With Us</FooterLink>
        </FooterColumn>

        {/* CONTACT */}
        <FooterColumn title="Contact & Support">
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

      {/* BOTTOM BAR */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted">
          <p>
            © {CURRENT_YEAR} Vedic Wellness — Ayurvedic PCD Pharma Franchise.
            All rights reserved.
          </p>
          <div className="flex gap-4">
            <FooterLink href="/site-map">Site Map</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms-conditions">Terms & Conditions</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- SUB COMPONENTS ---------- */

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
    <Link
      href={href}
      className="text-sm text-muted hover:text-accent transition-colors"
    >
      {children}
    </Link>
  );
}

const SocialLink = memo(function SocialLink({
  href,
  icon: Icon,
  label,
  className,
}: any) {
  return (
    <a
      href={href}
      target="_blank"
      aria-label={label}
      className={`h-11 w-11 flex items-center justify-center rounded-full transition hover:scale-105 ${className}`}
    >
      <Icon size={18} />
    </a>
  );
});