"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  PhoneCall,
  MessagesSquare,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "@/lib/toast";

import { reveal, staggerFast } from "@/app/animations";

import PageHeader from "@/components/public/ui/PageHeader";
import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Button from "@/components/public/ui/Button";
import Chip from "@/components/public/ui/Chip";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof Omit<FormState, "website">, string>>;

/* ------------------------------------------------------------------ */
/* Input styles */
/* ------------------------------------------------------------------ */

function inputClass(hasError: boolean) {
  return `
    w-full rounded-[14px] px-4 py-3 text-sm
    bg-[var(--bg-surface)]
    border
    text-[var(--text-main)]
    placeholder:text-[var(--text-muted)]
    transition
    focus:outline-none
    ${
      hasError
        ? "border-red-500/60"
        : "border-[var(--border-soft)] focus:border-[color:var(--brand-primary)]/50 focus:ring-2 focus:ring-[color:var(--brand-primary)]/25"
    }
  `;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
    website: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [turnstileToken, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const refs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const next: FieldErrors = {};
    if (form.name.length < 2) next.name = "Enter your full name";
    if (form.phone.length !== 10) next.phone = "10 digit phone required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Invalid email";
    if (form.city.length < 2) next.city = "Enter city / district";
    if (form.message.length < 10) next.message = "Min 10 characters";

    if (!turnstileToken) {
      toast.error("Verification required", "Please complete the captcha verification.");
      return;
    }

    if (Object.keys(next).length) {
      setErrors(next);
      toast.warning(
        "Invalid form details",
        Object.values(next)[0] || "Please fix highlighted fields."
      );
      return;
    }

    setLoading(true);

    const promise = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, turnstileToken }),
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res;
    });

    try {
      await promise;
      setForm({ name: "", phone: "", email: "", city: "", message: "", website: "" });
      setToken("");
      toast.success("Enquiry sent successfully", "We'll get back to you shortly.");
    } catch (err) {
      toast.error("Submission failed.", "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-20 space-y-14">
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} />
              Contact • Franchise Enquiry
            </Chip>
          }
          title={
            <>
              Connect with{" "}
              <span className="text-[color:var(--brand-accent)]">
                Vedic Wellness
              </span>
            </>
          }
          subtitle="Need product list, franchise offer, or distributor support? Reach us below."
        />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            "Fast Response",
            "Monopoly Rights",
            "PAN India Supply",
            "Marketing Support",
          ].map((t) => (
            <motion.div key={t} variants={reveal}>
              <Chip className="whitespace-nowrap">{t}</Chip>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 w-full">
          {/* FORM CARD */}
          <motion.div variants={reveal} className="group min-w-0">
            <Card className="h-full bg-white/80 dark:bg-black/45">
              <SectionHeading
                align="left"
                title="Send us an enquiry"
                subtitle="We usually respond within a few hours."
              />
              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <input
                  className="hidden"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    ref={refs.name}
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass(!!errors.name)}
                  />
                  <input
                    ref={refs.phone}
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) =>
                      update(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    className={inputClass(!!errors.phone)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    ref={refs.email}
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass(!!errors.email)}
                  />
                  <input
                    ref={refs.city}
                    placeholder="City / District"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputClass(!!errors.city)}
                  />
                </div>
                <textarea
                  ref={refs.message}
                  rows={5}
                  placeholder="Tell us your requirement..."
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={inputClass(!!errors.message)}
                />
                <div className="max-w-full overflow-hidden">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(t) => setToken(t)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1" isLoading={loading}>
                    Submit Enquiry
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() =>
                      window.open("https://wa.me/+919306025799", "_blank")
                    }
                  >
                    WhatsApp Instead
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* RIGHT SIDE INFO */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6 min-w-0"
          >
            {/* Quick Contact Card */}
            <motion.div variants={reveal} className="group">
              <Card className="bg-white/80 dark:bg-black/45">
                <SectionHeading
                  align="left"
                  title="Quick Contact"
                  subtitle="Choose the easiest way."
                />
                <div className="mt-6 space-y-5">
                  {/* PHONE */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <PhoneCall
                        className="text-[color:var(--brand-accent)] shrink-0 transition-transform duration-300 group-hover:scale-110"
                        size={20}
                      />
                      <span className="font-medium text-sm sm:text-base truncate">
                        +91 93060 25799
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      className="min-w-[80px] sm:min-w-[100px]"
                      onClick={() =>
                        (window.location.href = "tel:+919306025799")
                      }
                    >
                      Call
                    </Button>
                  </div>

                  {/* WHATSAPP */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <MessagesSquare
                        className="text-[color:var(--brand-accent)] shrink-0 transition-transform duration-300 group-hover:scale-110"
                        size={20}
                      />
                      <span className="font-medium text-sm sm:text-base truncate">
                        WhatsApp Support
                      </span>
                    </div>
                    <Button
                      className="min-w-[80px] sm:min-w-[100px]"
                      onClick={() =>
                        window.open("https://wa.me/+919306025799", "_blank")
                      }
                    >
                      WhatsApp
                    </Button>
                  </div>

                  {/* EMAIL */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail
                        className="text-[color:var(--brand-accent)] shrink-0 transition-transform duration-300 group-hover:scale-110"
                        size={20}
                      />
                      <span className="font-medium text-sm sm:text-base truncate break-all">
                        vedicwellnessid@gmail.com
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      className="min-w-[80px] sm:min-w-[100px]"
                      onClick={() =>
                        (window.location.href =
                          "mailto:vedicwellnessid@gmail.com")
                      }
                    >
                      Email
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Office & Availability Card */}
            <motion.div variants={reveal} className="group">
              <Card className="bg-white/80 dark:bg-black/45">
                <SectionHeading align="left" title="Office & Availability" />
                <div className="mt-6 space-y-4 text-sm sm:text-base">
                  <div className="flex gap-4">
                    <MapPin
                      className="text-[color:var(--brand-accent)] shrink-0 transition-transform duration-300 group-hover:-translate-y-1"
                      size={18}
                    />
                    <span className="leading-relaxed">
                      Plot no. 149–150, Markanda Complex, Dhulkot, Ambala City
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Clock
                      className="text-[color:var(--brand-accent)] shrink-0 transition-transform duration-300 group-hover:rotate-12"
                      size={18}
                    />
                    <span>Mon – Sat: 10:00 AM – 4:00 PM</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}