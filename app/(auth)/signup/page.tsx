export const dynamic = "force-dynamic";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};


import SignupClient from "@/app/(auth)/signup/SignupClient";

export default function SignupPage() {
  return <SignupClient />;
}
