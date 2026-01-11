import AdminLoginForm from "./AdminLoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="w-full max-w-md ">
        <h1 className="text-center text-3xl font-bold text-black dark:text-white">
          Admin Sign In
        </h1>

        <p className="mt-2 text-center text-black/70 dark:text-white/70">
          Sign in to access admin dashboard.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
