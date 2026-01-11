"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginForm() {
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      // ✅ Keep redirect:false so we can read error reliably
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // ❌ Invalid credentials
      if (!res || res.error) {
        setError("Wrong email or password");
        setIsLoading(false);
        return;
      }

      // ✅ IMPORTANT: hard redirect fixes mobile cookie/session timing issues
      window.location.href = "/admin";
    } catch (err) {
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-center mt-10 flex w-full max-w-md flex-col items-center gap-5"
    >
      {/* Email Input */}
      <input
        className="w-full rounded-md bg-neutral-900/90 px-4 py-3 text-lg text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#84eb4b] disabled:opacity-60"
        name="email"
        type="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />

      {/* Password Field + Toggle Button */}
      <div className="relative w-full">
        <input
          className="w-full rounded-md bg-neutral-900/90 px-4 py-3 pr-24 text-lg text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#84eb4b] disabled:opacity-60"
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

      {/* Submit Button */}
      <button
        className="w-full rounded-lg bg-neutral-900/90 py-4 text-center text-base font-semibold text-white shadow-md hover:bg-neutral-600/90 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      {/* Error Message */}
      {error ? (
        <div className="w-full rounded-md bg-red-600/90 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          {error}
        </div>
      ) : null}
    </form>
  );
}
