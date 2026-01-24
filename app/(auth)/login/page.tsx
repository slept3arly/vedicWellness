export const dynamic = "force-dynamic";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

import LoginClient from "@/app/(auth)/login/LoginClient";

export default function LoginPage() {
  return <LoginClient />;
}
