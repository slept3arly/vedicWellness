export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SignupForm from "@/app/(auth)/signup/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-black dark:text-white">
          Sign Up
        </h1>

        <p className="mt-2 text-center text-black/70 dark:text-white/70">
          Create an account to view products.
        </p>

        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
