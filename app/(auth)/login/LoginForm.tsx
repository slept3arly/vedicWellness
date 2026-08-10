"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import Button from "@/components/public/ui/Button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl =
    searchParams.get("callbackUrl") ||
    searchParams.get("next") ||
    "/";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email) {
      toast.warning("Email is required.", "Please enter your email address.");
      emailRef.current?.focus();
      setIsLoading(false);
      return;
    }

    if (!password) {
      toast.warning("Password is required.", "Please enter your password.");
      passwordRef.current?.focus();
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res) {
        toast.error("Login failed", "Unexpected authentication error.");
        setIsLoading(false);
        return;
      }

      if (res.error) {
        toast.error(
          "Wrong email or password",
          "Please check your credentials and try again."
        );

        emailRef.current?.focus();
        setIsLoading(false);
        return;
      }

      toast.success("Login successful", "Redirecting you now...");

      setTimeout(() => {
        router.push(callbackUrl);
      }, 300);
    } catch {
      toast.error("Something went wrong", "Please try again later.");
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto mt-10 flex w-full max-w-md flex-col gap-5"
    >
      <div className="space-y-1">
        <label
          htmlFor="login-email"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Email
        </label>

        <input
          ref={emailRef}
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-green-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="login-password"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Password
        </label>

        <div className="relative">
          <input
            ref={passwordRef}
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-green-500/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-3 py-2 text-sm font-semibold text-[#039751]"
            aria-pressed={showPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLoading}
          >
            {showPassword ? "Hide" : "View"}
          </button>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Log in
      </Button>
    </form>
  );
}
