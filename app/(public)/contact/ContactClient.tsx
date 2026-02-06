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

import PageHeader from "@/components/ui/PageHeader";
import GlassCard from "@/components/old_files/ui/GlassCard";
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

type FieldErrors = Partial<Record<keyof Omit<FormState, "website">, string>>;

function inputClass(hasError: boolean) {
  return `mt-2 w-full rounded-2xl border bg-white/70 px-4 py-3 text-slate-900 outline-none transition 
  dark:bg-slate-900/60 dark:text-white
  ${
    hasError
      ? "border-red-500/70"
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
    if (form.city.length < 2) next.city = "Enter city/district";
    if (form.message.length < 10) next.message = "Min 10 characters";

    if (!turnstileToken) {
      setStatus("error");
      setErrorMsg("Complete verification first");
      return;
    }

    if (Object.keys(next).length) {
      setErrors(next);
      setStatus("error");
      setErrorMsg("Fix highlighted fields");
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
      setErrorMsg("Submission failed. Try again.");
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
            <span className="inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Contact • Franchise Enquiry
            </span>
          }
          title={
            <>
              Connect with{" "}
              <span className="text-w dark:text-green-400">Vedic Wellness</span>
            </>
          }
          subtitle="Need product list, franchise offer, or distributor support? Reach us below."
        />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          {["Fast Response", "Monopoly Rights", "PAN India Supply", "Marketing Support"].map(
            (t) => (
              <motion.div key={t} variants={reveal}>
                <Chip>{t}</Chip>
              </motion.div>
            )
          )}
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          {/* FORM */}
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <GlassCard className="p-6 md:p-8">
              <SectionHeading
                align="left"
                title="Send us an enquiry"
                subtitle="Fill the form and we’ll send product list + franchise offer within 24 hours."
              />

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">

                <input
                  className="hidden"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input ref={refs.name} placeholder="Full Name" value={form.name}
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
                  <p className="text-green-600 font-medium">✅ Enquiry sent successfully</p>
                )}

                {status === "error" && (
                  <p className="text-red-500 font-medium">❌ {errorMsg}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Enquiry"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => window.open("https://wa.me/+919306025799", "_blank")}
                  >
                    WhatsApp Instead
                  </Button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  *We usually respond within a few hours.
                </p>
              </form>
            </GlassCard>
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
              <GlassCard className="p-6 md:p-8">
                <SectionHeading align="left" title="Quick Contact" subtitle="Choose the easiest way." />

                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                    <PhoneCall size={22} className="text-green-600" />
                    <div className="flex-1">+91 9306025799</div>
                    <Button variant="secondary" onClick={() => window.location.href="tel:+919306025799"}>Call</Button>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-green-600/25 bg-green-500/10 p-5">
                    <MessagesSquare size={22} className="text-green-600" />
                    <div className="flex-1">WhatsApp Support</div>
                    <Button onClick={() => window.open("https://wa.me/+919306025799")}>WhatsApp</Button>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                    <Mail size={22} className="text-green-600" />
                    vedicwellnessid@gmail.com
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={reveal}>
              <GlassCard className="p-6 md:p-8">
                <SectionHeading align="left" title="Office & Availability" />

                <div className="mt-6 space-y-4">
                  <div className="flex gap-4">
                    <MapPin className="text-green-600" />
                    Plot no. 149–150, Markanda Complex, Dhulkot, Ambala City
                  </div>
                  <div className="flex gap-4">
                    <Clock className="text-green-600" />
                    Mon – Sat: 10:00 AM – 4:00 PM
                  </div>
                </div>
              </GlassCard>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
