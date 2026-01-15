"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // ✅ redirect user to login, preserving next destination
      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch {
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-center mt-10 flex w-full max-w-md flex-col items-center gap-5"
    >
      <input
        className="w-full rounded-md bg-neutral-900/90 px-4 py-3 text-lg text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#84eb4b] disabled:opacity-60"
        name="email"
        type="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />

      <div className="relative w-full">
        <input
          className="w-full rounded-md bg-neutral-900/90 px-4 py-3 pr-24 text-lg text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#84eb4b] disabled:opacity-60"
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

      <button
        className="w-full rounded-lg bg-neutral-900/90 py-4 text-center text-base font-semibold text-white shadow-md hover:bg-neutral-600/90 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create account"}
      </button>

      <div className="text-center text-sm text-black/70 dark:text-white/70">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[#039751] hover:text-[#84eb4b]"
        >
          Sign in
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
