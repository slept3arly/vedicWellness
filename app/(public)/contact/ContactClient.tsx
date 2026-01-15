"use client";

import { useState } from "react";
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

// UI Components
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
  website: string; // honeypot
};

type FieldErrors = Partial<
  Record<"name" | "phone" | "email" | "city" | "message", string>
>;

function inputClass(hasError: boolean) {
  return `mt-2 w-full rounded-2xl border bg-white/70 px-4 py-3 text-slate-900 outline-none backdrop-blur transition dark:bg-slate-950/40 dark:text-white
  ${
    hasError
      ? "border-red-500/70 focus:border-red-500/80"
      : "border-slate-200 focus:border-green-600/40 dark:border-slate-800"
  }`;
}

export default function ContactPage() {
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

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setError(field: keyof FieldErrors, msg: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setErrorMsg("");
    setFieldErrors({});

    // ✅ CLIENT VALIDATION (fast UX)
    let ok = true;

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("name", "Please enter your full name.");
      ok = false;
    }

    if (!form.phone.trim() || form.phone.trim().length < 7) {
      setError("phone", "Please enter a valid phone number.");
      ok = false;
    }

    if (!form.city.trim() || form.city.trim().length < 2) {
      setError("city", "Please enter your city/district.");
      ok = false;
    }

    if (!form.email.trim()) {
      setError("email", "Email is required.");
      ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("email", "Please enter a valid email.");
      ok = false;
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      setError("message", "Message must be at least 10 characters.");
      ok = false;
    }

    if (!turnstileToken) {
      setStatus("error");
      setErrorMsg("Please complete the verification.");
      return;
    }

    if (!ok) {
      setStatus("error");
      setErrorMsg("Please correct the highlighted fields.");
      return;
    }

    // ✅ SEND TO API
    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          message: form.message,
          website: form.website, // honeypot
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");

        // server zod field errors (if returned)
        const fe = data?.issues?.fieldErrors;
        if (fe) {
          setFieldErrors({
            name: fe.name?.[0],
            phone: fe.phone?.[0],
            email: fe.email?.[0],
            city: fe.city?.[0],
            message: fe.message?.[0],
          });
          setErrorMsg("Please correct the highlighted fields.");
        } else {
          setErrorMsg(data?.error ?? "Failed to submit. Please try again.");
        }

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

      // token is one-time use
      setTurnstileToken("");
    } catch (err) {
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
        {/* PAGE HEADER */}
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Contact • Franchise Enquiry
            </p>
          }
          title={
            <>
              Let’s connect with{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>
            </>
          }
          subtitle="Need product list, franchise offer, or distributor support? Contact us using the options below."
        />

        {/* QUICK TRUST CHIPS */}
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

        {/* MAIN GRID */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* LEFT — CONTACT FORM */}
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

              <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
                {/* Honeypot field */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass(!!fieldErrors.name)}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClass(!!fieldErrors.phone)}
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass(!!fieldErrors.email)}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      City / District
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className={inputClass(!!fieldErrors.city)}
                    />
                    {fieldErrors.city && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us what you need (product list / franchise offer / MOQ / area monopoly)..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={inputClass(!!fieldErrors.message)}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Turnstile */}
                <div className="pt-2">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    options={{ theme: "auto" }}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                  />
                </div>

                {/* Status */}
                {status === "success" && (
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    ✅ Thanks! Your enquiry was sent successfully.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    ❌ {errorMsg || "Something went wrong. Please try again."}
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
                      window.open("https://wa.me/910000000000", "_blank")
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

          {/* RIGHT — QUICK CONTACT INFO */}
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
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                      <PhoneCall size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-slate-900 dark:text-white">
                        Call Us
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        +91 00000 00000
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.href = "tel:+910000000000")}
                    >
                      Call
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-600/25 bg-green-500/10 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/20 p-3 text-green-800">
                      <MessagesSquare size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-slate-900">
                        WhatsApp
                      </p>
                      <p className="text-sm text-slate-700">
                        Get product list instantly
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        window.open("https://wa.me/910000000000", "_blank")
                      }
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                      <Mail size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-slate-900 dark:text-white">
                        Email
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        support@vedicwellness.in
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
                      Chandigarh, India (Innovia Drugs)
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
                      Mon – Sat: 10:00 AM – 6:00 PM
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
