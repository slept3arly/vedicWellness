import AdminLoginForm from "./AdminLoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="w-full max-w-md ">
        <div className="bg-neutral-900/90 py-3 rounded-lg">
        <h1 className="text-center text-3xl font-bold text-white">
          Admin Sign In
        </h1>

        <p className="mt-2 text-center text-white/70">
          Sign in to access admin dashboard.
        </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
