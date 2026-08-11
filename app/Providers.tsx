"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { MenuProvider } from "@/components/MenuContext";
import type { Session } from "next-auth";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <SessionProvider
          session={session}
          refetchOnWindowFocus={false}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <MenuProvider>{children}</MenuProvider>
          </ThemeProvider>
        </SessionProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
