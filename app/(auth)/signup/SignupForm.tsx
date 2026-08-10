"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "@/lib/toast";
import Button from "@/components/public/ui/Button";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const next =
    searchParams.get("next") ||
    searchParams.get("callbackUrl") ||
    "/products";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    if (!turnstileToken) {
      toast.warning("Security check required",
        "Please complete the security check.",
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!name) {
      toast.warning("Name is required", "Please enter your name.");
      nameRef.current?.focus();
      return;
    }

    if (!email) {
      toast.warning("Email is required",
        "Please enter your email address.",
      );
      emailRef.current?.focus();
      return;
    }

    if (!password || password.length < 8) {
      toast.warning("Weak password",
        "Password must be at least 8 characters long.",
      );
      passwordRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error("Signup failed",
          data?.error || "Unable to create account.",
        );
        setIsLoading(false);
        return;
      }

      toast.success("Account created", "Redirecting you to login.",
      );

      router.push(`/login?next=${encodeURIComponent(next)}`);

    } catch {
      toast.error("Something went wrong",
        "Please try again later.",
      );
      setIsLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-10 flex w-full max-w-md flex-col gap-5"
      >
        {/* NAME */}
        <div className="space-y-1">
          <label
            htmlFor="signup-name"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Name
          </label>

          <input
            ref={nameRef}
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-green-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
          />
        </div>

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

        {/* CAPTCHA */}
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ theme: "auto" }}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken("")}
          onError={() => setTurnstileToken("")}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!turnstileToken}
          className="w-full"
        >
          Create account
        </Button>

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
    </>
  );
}
