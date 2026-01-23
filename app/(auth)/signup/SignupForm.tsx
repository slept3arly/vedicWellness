"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next =
    searchParams.get("next") ||
    searchParams.get("callbackUrl") ||
    "/products";

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Turnstile token
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");

    // ✅ require turnstile before submit
    if (!turnstileToken) {
      setError("Please complete the verification.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          turnstileToken, // ✅ send token to server
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // token is one-time use
      setTurnstileToken("");

      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch {
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 flex w-full max-w-md flex-col gap-5"
    >
      <input
        className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 outline-none shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-green-500/40 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500"
        name="email"
        type="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />

      <div className="relative w-full">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-900 outline-none shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-green-500/40 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password (min 8 chars)"
          minLength={8}
          required
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-3 py-2 text-sm font-semibold text-[#039751] hover:text-[#84eb4b] disabled:opacity-50"
          disabled={isLoading}
        >
          {showPassword ? "Hide" : "View"}
        </button>
      </div>

      {/* ✅ Turnstile widget */}
      <div className="w-full pt-2">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ theme: "auto" }}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken("")}
          onError={() => setTurnstileToken("")}
        />
      </div>

      <button
        className="w-full rounded-xl bg-green-600 py-3.5 text-base font-semibold text-white shadow-md hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading || !turnstileToken}
      >
        {isLoading ? "Creating..." : "Create account"}
      </button>

      {/* ✅ “Already have account?” */}
      <div className="text-center text-sm text-black/70 dark:text-white/70">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[#039751] hover:text-[#84eb4b]"
        >
          Log In
        </a>
      </div>

      {error ? (
        <div className="w-full rounded-md bg-red-600/90 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          {error}
        </div>
      ) : null}
    </form>
  );
}
