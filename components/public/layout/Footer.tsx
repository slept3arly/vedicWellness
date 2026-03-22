"use client";

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
      className="
      border-t border-neutral-200 dark:border-[var(--border-soft)]
      bg-white dark:bg-[var(--bg-surface)]
      text-neutral-900 dark:text-white
      "
    >
      <div
        className="
        max-w-7xl mx-auto px-4 py-14 md:px-6
        grid gap-10
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-[1.2fr_1fr_1fr_1fr]
      "
      >
        {/* BRAND COLUMN */}
        <div className="space-y-6 md:border-r md:border-neutral-200 dark:md:border-neutral-800 md:pr-10 text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo.svg"
              alt="Vedic Wellness Logo"
              width={220}
              height={80}
              className="w-[140px] md:w-auto md:max-w-[200px] h-auto"
            />
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto md:mx-0">
            Vedic Wellness is a GMP certified Ayurvedic PCD Pharma company
            delivering high-quality herbal formulations.
          </p>

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
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/products">Our Formulations</FooterLink>
          <FooterLink href="/blogs">Knowledge Center</FooterLink>
        </FooterColumn>

        {/* FRANCHISE */}
        <FooterColumn title="Franchise Opportunities">
          <FooterLink href="/contact">Apply for Franchise</FooterLink>
          <FooterLink href="/products">View Products</FooterLink>
          <FooterLink href="/about">Why Partner With Us</FooterLink>
        </FooterColumn>

        {/* CONTACT */}
        <FooterColumn title="Contact & Support">
          <div className="space-y-5 text-sm text-neutral-600 dark:text-neutral-400">
            
            {/* MAP */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Innovia+Drugs+India"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-start group transition-colors w-fit"
            >
              <MapPin
                size={20}
                className="shrink-0 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              />
              <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                Plot no. 149–150, Markanda Complex, Dhulkot, Ambala City
              </span>
            </a>

            {/* PHONE */}
            <a
              href="tel:+919306025799"
              className="flex gap-3 items-center group w-fit"
            >
              <Phone
                size={20}
                className="shrink-0 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              />
              <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                +91 93060 25799
              </span>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:vedicwellnessid@gmail.com"
              className="flex gap-3 items-center group w-fit"
            >
              <Mail
                size={20}
                className="shrink-0 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              />
              <span className="group-hover:text-neutral-900 dark:group-hover:text-white transition-colors break-all">
                vedicwellnessid@gmail.com
              </span>
            </a>
          </div>
        </FooterColumn>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-500">
          <p className="text-center md:text-left">
            © {CURRENT_YEAR} Vedic Wellness — Ayurvedic PCD Pharma Franchise.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <FooterLink href="/site-map">Site Map</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms-conditions">
              Terms & Conditions
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function FooterColumn({ title, children }: any) {
  return (
    <div className="space-y-5">
      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
        {title}
      </h4>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: any) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="
      group relative w-fit text-sm
      text-neutral-600 dark:text-neutral-400
      hover:text-neutral-900 dark:hover:text-white
      transition-colors duration-300
      "
    >
      {children}
      <span
        className="
        absolute left-0 -bottom-1 h-[1px] w-0
        bg-neutral-900 dark:bg-white
        transition-all duration-300 group-hover:w-full
        "
      />
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
      className={`group relative h-11 w-11 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${className}`}
    >
      <span
        className="
        absolute -top-10 scale-0 opacity-0
        group-hover:scale-100 group-hover:opacity-100
        transition-all duration-200
        bg-white text-black text-[10px] font-bold
        py-1 px-2 rounded whitespace-nowrap
        pointer-events-none shadow-lg z-50
        "
      >
        {label}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
      </span>

      <Icon size={20} className="shrink-0" />
    </a>
  );
});