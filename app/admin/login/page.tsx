import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Sign In</h1>
      <p style={{ opacity: 0.7 }}>Sign in to access admin dashboard.</p>

      <form
        action={async (formData) => {
          "use server";
          const email = String(formData.get("email"));
          const password = String(formData.get("password"));

          await signIn("credentials", {
            email,
            password,
            redirectTo: "/admin",
          });
        }}
        style={{ marginTop: 18, display: "grid", gap: 10 }}
      >
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
