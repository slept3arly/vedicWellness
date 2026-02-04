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

import { fadeUp, stagger } from "@/app/animations";

import PageHeader from "@/components/ui/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  website: string;
};

type FieldErrors = Partial<
  Record<"name" | "phone" | "email" | "city" | "message", string>
>;

function inputClass(hasError: boolean) {
  return `mt-2 w-full rounded-2xl border bg-white/70 px-4 py-3 text-slate-900 outline-none transition dark:bg-slate-950/40 dark:text-white
  ${
    hasError
      ? "border-red-500/70 focus:border-red-500/80"
      : "border-slate-200 focus:border-green-600/40 dark:border-slate-800"
  }`;
}

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
    website: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function focusFirstError(errors: FieldErrors) {
    const order = ["name", "phone", "email", "city", "message"] as const;
    const refs = {
      name: nameRef,
      phone: phoneRef,
      email: emailRef,
      city: cityRef,
      message: messageRef,
    };

    for (const key of order) {
      if (errors[key]) {
        refs[key]?.current?.focus();
        break;
      }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setErrorMsg("");
    setFieldErrors({});

    const nextErrors: FieldErrors = {};
    let ok = true;

    if (!form.name.trim() || form.name.length < 2) {
      nextErrors.name = "Please enter your full name.";
      ok = false;
    }

    if (!form.phone.trim() || form.phone.length !== 10) {
      nextErrors.phone = "Phone number must be exactly 10 digits.";
      ok = false;
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
      ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email.";
      ok = false;
    }

    if (!form.city.trim() || form.city.length < 2) {
      nextErrors.city = "Please enter your city/district.";
      ok = false;
    }

    if (!form.message.trim() || form.message.length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
      ok = false;
    }

    if (!turnstileToken) {
      setStatus("error");
      setErrorMsg("Please complete the verification.");
      return;
    }

    if (!ok) {
      setFieldErrors(nextErrors);
      setStatus("error");
      setErrorMsg("Please correct the highlighted fields.");
      focusFirstError(nextErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Failed to submit. Please try again.");
        return;
      }

      setStatus("success");
      setErrorMsg("");

      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        message: "",
        website: "",
      });

      setTurnstileToken("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Contact • Franchise Enquiry
            </p>
          }
          title={
            <>
              Connect with{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>
            </>
          }
          subtitle="Need product list, franchise offer, or distributor support? Contact us using the options below."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap justify-center gap-5"
        >
          {["Fast Response", "Monopoly Rights", "PAN India Supply", "Marketing Support"].map(
            (t) => (
              <motion.div key={t} variants={fadeUp}>
                <Chip>{t}</Chip>
              </motion.div>
            )
          )}
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* LEFT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <GlassCard className="p-6 md:p-8">
              <SectionHeading
                align="left"
                title="Send us an enquiry"
                subtitle="Fill the form and we’ll send product list + franchise offer within 24 hours."
              />

              <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-semibold">
                      Full Name
                    </label>
                    <input
                      ref={nameRef}
                      id="contact-name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      className={inputClass(!!fieldErrors.name)}
                    />
                    {fieldErrors.name && (
                      <p id="name-error" className="mt-1 text-xs text-red-500">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="text-sm font-semibold">
                      Phone Number
                    </label>
                    <input
                      ref={phoneRef}
                      id="contact-phone"
                      placeholder="10-digit phone number"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) =>
                        update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                      className={inputClass(!!fieldErrors.phone)}
                    />
                    {fieldErrors.phone && (
                      <p id="phone-error" className="mt-1 text-xs text-red-500">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className="text-sm font-semibold">
                      Email
                    </label>
                    <input
                      ref={emailRef}
                      id="contact-email"
                      placeholder="example@gmail.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      className={inputClass(!!fieldErrors.email)}
                    />
                    {fieldErrors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-500">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-city" className="text-sm font-semibold">
                      City / District
                    </label>
                    <input
                      ref={cityRef}
                      id="contact-city"
                      placeholder="Enter location"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      aria-invalid={!!fieldErrors.city}
                      aria-describedby={fieldErrors.city ? "city-error" : undefined}
                      className={inputClass(!!fieldErrors.city)}
                    />
                    {fieldErrors.city && (
                      <p id="city-error" className="mt-1 text-xs text-red-500">
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-sm font-semibold">
                    Message
                  </label>
                  <textarea
                    ref={messageRef}
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us what you need (product list / franchise offer / MOQ / area monopoly)..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? "message-error" : undefined}
                    className={inputClass(!!fieldErrors.message)}
                  />
                  {fieldErrors.message && (
                    <p id="message-error" className="mt-1 text-xs text-red-500">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    options={{ theme: "auto" }}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                  />
                </div>

                {/* STATUS near submit (as before) */}
                {status === "success" && (
                  <p role="status" aria-live="polite" className="text-sm font-medium text-green-700">
                    ✅ Thanks! Your enquiry was sent successfully.
                  </p>
                )}

                {status === "error" && (
                  <p role="alert" aria-live="assertive" className="text-sm font-medium text-red-600">
                    ❌ {errorMsg}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading || !turnstileToken}
                  >
                    {loading ? "Submitting..." : "Submit Enquiry"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() =>
                      window.open("https://wa.me/+919306025799", "_blank")
                    }
                  >
                    WhatsApp Instead
                  </Button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  *We usually respond within a few hours during working time.
                </p>
              </form>
            </GlassCard>
          </motion.div>

          {/* RIGHT SIDE — unchanged */}
          <motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.45, delay: 0.05 }}
  className="space-y-6"
>
  <GlassCard className="p-6 md:p-8">
    <SectionHeading
      align="left"
      title="Quick Contact"
      subtitle="Choose the easiest way to reach us."
    />

    <div className="mt-6 grid gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
            <PhoneCall size={22} />
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-slate-900 dark:text-white">
              Call Us
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              +91 9306025799
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "tel:+919306025799")}
          >
            Call
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-green-600/25 bg-green-500/10 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
            <MessagesSquare size={22} />
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-slate-900 dark:text-white">
              WhatsApp
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Get product list instantly
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() =>
              window.open("https://wa.me/+919306025799", "_blank")
            }
          >
            WhatsApp
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
            <Mail size={22} />
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-slate-900 dark:text-white">
              Email
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              vedicwellnessid@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>

  <GlassCard className="p-6 md:p-8">
    <SectionHeading
      align="left"
      title="Office & Availability"
      subtitle="Working hours and business information."
    />

    <div className="mt-6 grid gap-4">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
          <MapPin size={22} />
        </div>
        <div>
          <p className="font-heading font-bold text-slate-900 dark:text-white">
            Address
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Plot no. 149–150, Markanda Complex, Dhulkot, Ambala City
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
          <Clock size={22} />
        </div>
        <div>
          <p className="font-heading font-bold text-slate-900 dark:text-white">
            Working Hours
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Mon – Sat: 10:00 AM – 4:00 PM
          </p>
        </div>
      </div>
    </div>
  </GlassCard>
</motion.div>

        </div>
      </div>
    </section>
  );
}
