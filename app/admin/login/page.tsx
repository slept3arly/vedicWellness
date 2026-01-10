import AdminLoginForm from "./AdminLoginForm";

export default function LoginPage() {
  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Sign In</h1>
      <p style={{ opacity: 0.7 }}>Sign in to access admin dashboard.</p>

      <AdminLoginForm />
    </div>
  );
}
