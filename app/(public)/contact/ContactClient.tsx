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

import { reveal, staggerFast } from "@/app/animations";

import PageHeader from "@/components/public/PageHeader";
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
/* Input styles (system aligned) */
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
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

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

  function focusFirstError(err: FieldErrors) {
    for (const k of Object.keys(refs) as (keyof typeof refs)[]) {
      if (err[k]) {
        refs[k].current?.focus();
        break;
      }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setErrors({});
    setErrorMsg("");

    const next: FieldErrors = {};

    if (form.name.length < 2) next.name = "Enter your full name";
    if (form.phone.length !== 10) next.phone = "10 digit phone required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Invalid email";
    if (form.city.length < 2) next.city = "Enter city / district";
    if (form.message.length < 10) next.message = "Min 10 characters";

    if (!turnstileToken) {
      setStatus("error");
      setErrorMsg("Please complete verification first.");
      return;
    }

    if (Object.keys(next).length) {
      setErrors(next);
      setStatus("error");
      setErrorMsg("Please fix highlighted fields.");
      focusFirstError(next);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        message: "",
        website: "",
      });
      setToken("");
    } catch {
      setStatus("error");
      setErrorMsg("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20 space-y-14">

        {/* Header */}
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

        {/* Trust chips */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {["Fast Response", "Monopoly Rights", "PAN India Supply", "Marketing Support"].map(
            (t) => (
              <motion.div key={t} variants={reveal}>
                <Chip>{t}</Chip>
              </motion.div>
            )
          )}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* FORM */}
          <motion.div variants={reveal}>
            <Card className="bg-white/80 dark:bg-black/45">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <input ref={refs.name} placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass(!!errors.name)} />

                  <input ref={refs.phone} placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) =>
                      update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className={inputClass(!!errors.phone)} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input ref={refs.email} placeholder="Email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass(!!errors.email)} />

                  <input ref={refs.city} placeholder="City / District"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputClass(!!errors.city)} />
                </div>

                <textarea
                  ref={refs.message}
                  rows={5}
                  placeholder="Tell us your requirement..."
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={inputClass(!!errors.message)}
                />

                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(t) => setToken(t)}
                />

                {status === "success" && (
                  <p className="text-sm font-medium text-[color:var(--brand-accent)]">
                    ✅ Enquiry sent successfully
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm font-medium text-red-500">
                    ❌ {errorMsg}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Enquiry"}
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

          {/* RIGHT SIDE */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={reveal}>
              <Card>
                <SectionHeading
                  align="left"
                  title="Quick Contact"
                  subtitle="Choose the easiest way."
                />

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <PhoneCall className="text-[color:var(--brand-accent)]" />
                    <span className="flex-1">+91 93060 25799</span>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        (window.location.href = "tel:+919306025799")
                      }
                    >
                      Call
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <MessagesSquare className="text-[color:var(--brand-accent)]" />
                    <span className="flex-1">WhatsApp Support</span>
                    <Button
                      onClick={() =>
                        window.open("https://wa.me/+919306025799", "_blank")
                      }
                    >
                      WhatsApp
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <Mail className="text-[color:var(--brand-accent)]" />
                    vedicwellnessid@gmail.com
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={reveal}>
              <Card>
                <SectionHeading align="left" title="Office & Availability" />

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex gap-4">
                    <MapPin className="text-[color:var(--brand-accent)]" />
                    Plot no. 149–150, Markanda Complex, Dhulkot, Ambala City
                  </div>
                  <div className="flex gap-4">
                    <Clock className="text-[color:var(--brand-accent)]" />
                    Mon – Sat: 10:00 AM – 4:00 PM
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
