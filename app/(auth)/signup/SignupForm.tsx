"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "sonner";

export default function SignupForm() {
  const searchParams = useSearchParams();

  const next =
    searchParams.get("next") ||
    searchParams.get("callbackUrl") ||
    "/products";

  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    if (!turnstileToken) {
      toast.warning("Verification required", {
        description: "Please complete the captcha verification.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email) {
      toast.warning("Email is required", {
        description: "Please enter your email address.",
      });
      emailRef.current?.focus();
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      toast.warning("Weak password", {
        description: "Password must be at least 8 characters long.",
      });
      passwordRef.current?.focus();
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error("Signup failed", {
          description: data?.error || "Unable to create account.",
        });
        setIsLoading(false);
        return;
      }

      toast.success("Account created 🎉", {
        description:
          "We've sent you a verification email. Please check your inbox.",
      });

      setSuccess(true);
      setTurnstileToken("");
      setIsLoading(false);
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm dark:border-green-800 dark:bg-green-900/20">
        <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
          Check your email
        </h2>

        <p className="mt-2 text-sm text-green-700/80 dark:text-green-300/80">
          We've sent you a verification link. Please check your inbox and
          click the link to activate your account.
        </p>

        <p className="mt-4 text-xs text-muted">
          After verification, you’ll be automatically logged in.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto mt-10 flex w-full max-w-md flex-col gap-5"
    >
      {/* EMAIL */}
      <div className="space-y-1">
        <label
          htmlFor="signup-email"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Email
        </label>

        <input
          ref={emailRef}
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-green-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1">
        <label
          htmlFor="signup-password"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Password (minimum 8 characters)
        </label>

        <div className="relative">
          <input
            ref={passwordRef}
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-green-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-3 py-2 text-sm font-semibold text-[#039751]"
          >
            {showPassword ? "Hide" : "View"}
          </button>
        </div>
      </div>

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        options={{ theme: "auto" }}
        onSuccess={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken("")}
        onError={() => setTurnstileToken("")}
      />

      <button
        type="submit"
        disabled={isLoading || !turnstileToken}
        className="w-full rounded-xl bg-green-600 py-3.5 text-base font-semibold text-white shadow-md hover:bg-green-700 disabled:opacity-60"
      >
        {isLoading ? "Creating..." : "Create account"}
      </button>

      <div className="text-center text-sm text-black/70 dark:text-white/70">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[#039751] hover:text-[#84eb4b]"
        >
          Log In
        </a>
      </div>
    </form>
  );
}