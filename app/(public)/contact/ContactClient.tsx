"use client";

import { useState, useRef } from "react";
import {
  PhoneCall,
  MessagesSquare,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "@/lib/toast";

import PageHeader from "@/components/public/ui/PageHeader";
import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Button from "@/components/public/ui/Button";
import TurnstileField from "@/components/public/ui/TurnstileField";

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
    } catch {
      toast.error("Submission failed.", "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 lg:pt-20">
        <PageHeader
          title={
            <>
              Contact{" "}
              <span className="text-[color:var(--brand-accent)]">
                Vedic Wellness
              </span>
            </>
          }
          subtitle="Have a product, franchise or distribution enquiry? Get in touch with our team."
        />

        <div className="grid gap-8 lg:grid-cols-2 w-full">
          {/* FORM CARD */}
          <div className="group min-w-0">
            <Card className="h-full bg-white/80 dark:bg-black/45">
              <SectionHeading
                align="left"
                title="Send us an enquiry"
                subtitle="We usually respond within a few hours."
              />
              <form onSubmit={onSubmit} className="mt-6 grid gap-4 w-full min-w-0 max-w-full">
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
                
                <TurnstileField
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(t) => setToken(t)}
                />

                {/* FIXED BUTTON LAYOUT */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <Button 
                    type="submit" 
                    className="min-w-0 w-full px-1 text-[10px] sm:px-5 sm:text-[13px]"
                    isLoading={loading}
                  >
                    Submit Enquiry
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-w-0 w-full px-1 text-[10px] sm:px-5 sm:text-[13px]"
                    onClick={() =>
                      window.open("https://wa.me/+919306025799", "_blank")
                    }
                  >
                    WhatsApp Instead
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="grid min-w-0 gap-6">
            {/* Quick Contact Card */}
            <div className="group">
              <Card className="bg-white/80 dark:bg-black/45">
                <SectionHeading
                  align="left"
                  title="Quick Contact"
                  subtitle="Choose the easiest way."
                />
                <div className="mt-6 grid gap-5">
                  <div className="grid gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <PhoneCall
                        className="text-[color:var(--brand-accent)] shrink-0"
                        size={20}
                      />
                      <span className="min-w-0 break-words font-medium text-sm sm:text-base">
                        +91 93060 25799
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <MessagesSquare
                        className="text-[color:var(--brand-accent)] shrink-0"
                        size={20}
                      />
                      <span className="min-w-0 break-words font-medium text-sm sm:text-base">
                        WhatsApp Support
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <Mail
                        className="text-[color:var(--brand-accent)] shrink-0"
                        size={20}
                      />
                      <span className="min-w-0 break-all font-medium text-sm sm:text-base">
                        vedicwellnessid@gmail.com
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid grid-cols-[2fr_3fr] gap-3">
                      <Button
                        variant="secondary"
                        className="w-full min-w-0 px-2"
                        onClick={() =>
                          (window.location.href = "tel:+919306025799")
                        }
                      >
                        Call
                      </Button>
                      <Button
                        className="w-full min-w-0 px-2"
                        onClick={() =>
                          window.open("https://wa.me/+919306025799", "_blank")
                        }
                      >
                        WhatsApp
                      </Button>
                    </div>
                    <div className="grid grid-cols-[3fr_2fr] gap-3">
                      <Button
                        variant="secondary"
                        className="w-full min-w-0 px-2"
                        onClick={() =>
                          window.open(
                            "https://www.google.com/maps/search/?api=1&query=Innovia+Drugs+India",
                            "_blank"
                          )
                        }
                      >
                        Directions
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full min-w-0 px-2"
                        onClick={() =>
                          (window.location.href =
                            "mailto:vedicwellnessid@gmail.com")
                        }
                      >
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="group">
              <Card className="bg-white/80 dark:bg-black/45">
                <SectionHeading align="left" title="Office & Availability" />
                <div className="mt-6 space-y-4 text-sm sm:text-base">
                  <div className="flex gap-4">
                    <MapPin
                      className="text-[color:var(--brand-accent)] shrink-0"
                      size={18}
                    />
                    <span className="min-w-0 break-words leading-relaxed">
                      Plot no. 149–150, Markanda Complex, Dhulkot, Ambala City
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Clock
                      className="text-[color:var(--brand-accent)] shrink-0"
                      size={18}
                    />
                    <span className="min-w-0 break-words">Mon – Sat: 10:00 AM – 4:00 PM</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
