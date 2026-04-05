"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { MenuProvider } from "@/components/MenuContext";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MenuProvider>{children}</MenuProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}