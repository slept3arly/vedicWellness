"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));

        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!res?.ok) {
          setError("Invalid email or password");
          return;
        }

        router.push("/admin");
      }}
      style={{ marginTop: 18, display: "grid", gap: 10 }}
    >
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign in</button>

      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </form>
  );
}
