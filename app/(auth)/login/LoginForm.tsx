"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl =
  searchParams.get("callbackUrl") ||
  searchParams.get("next") ||
  "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Wrong email or password");
        setIsLoading(false);
        return;
      }

      // hard redirect avoids mobile cookie timing issues
      window.location.href = callbackUrl;
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
          placeholder="Password"
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
        className="w-full rounded-xl bg-green-600 py-3.5 text-base font-semibold text-white shadow-md hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Log in"}
      </button>

      {error ? (
        <div className="w-full rounded-md bg-red-600/90 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          {error}
        </div>
      ) : null}
    </form>
  );
}
