export const dynamic = "force-dynamic";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-black dark:text-white">
  Log In
</h1>

<p className="mt-2 text-center text-black/70 dark:text-white/70">
  Log in to view products and manage your account.
</p>
        <div className="text-center text-sm text-black/70 dark:text-white/70">
  Don&apos;t have an account?{" "}
  <a
    href="/signup"
    className="font-semibold text-[#039751] hover:text-[#84eb4b]"
  >
    Create one
  </a>
</div>


        {/* Suspense fixes useSearchParams build crash */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
