"use client";

import { Suspense } from "react";
import { m } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { fadeUpSoft } from "@/app/animations";

import Card from "@/components/public/ui/Card";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";

import LoginForm from "./LoginForm";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next =
    searchParams.get("next") ||
    searchParams.get("callbackUrl") ||
    "/products";

  const signupHref = `/signup?next=${encodeURIComponent(next)}`;

  return (
    <section className="min-h-[calc(100dvh-7.5rem)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:min-h-[calc(100dvh-7.5rem)] lg:grid-cols-2 lg:content-center lg:items-start lg:gap-16 lg:py-16">
        <div className="lg:self-center">
          <PageHeader
            align="left"
            className="space-y-2 text-center lg:text-left"
            title={
              <>
                <span className="lg:hidden">Welcome back</span>
                <span className="hidden lg:inline">
                  Welcome back to <span className="text-brand-accent">Vedic Wellness</span>
                </span>
              </>
            }
            subtitle={
              <span className="font-body text-sm font-normal leading-5 text-slate-500 dark:text-slate-400">
                Log in to access products and partner tools.
              </span>
            }
          />
          <ul className="mx-auto mt-5 hidden max-w-sm space-y-3 text-left text-sm text-slate-600 dark:text-slate-300 lg:mx-0 lg:block">
            {[
              "Access product catalogues and member tools.",
              "Keep partner resources available in one place.",
              "Get faster access to ordering and support.",
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-accent" size={17} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <m.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="w-full max-w-xl mx-auto lg:max-w-2xl lg:mx-0"
        >
          <Card className="bg-white/80 shadow-[0_24px_60px_rgba(2,101,54,0.25)] dark:bg-black/45 lg:px-8 lg:py-7">
            <SectionHeading 
              title="Log In" 
              className="text-center" 
            />

            <p className="mt-2 text-center text-sm leading-5 text-muted">
              Don’t have an account?{" "}
              <a
                href={signupHref}
                className="font-semibold text-brand-accent hover:underline"
              >
                Create one
              </a>
            </p>

            <div className="mt-5">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-muted">
              By logging in, you agree to our{" "}
              <a href="/terms-conditions" className="font-semibold text-brand-accent hover:underline">Terms</a>{" "}
              and{" "}
              <a href="/privacy-policy" className="font-semibold text-brand-accent hover:underline">Privacy Policy</a>.
            </p>
          </Card>
        </m.div>

      </div>
    </section>
  );
}
