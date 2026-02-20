import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

import type { User } from "next-auth";
import type { Role } from "@prisma/client";

import { headers } from "next/headers";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";

async function getIpFromNextHeaders() {
  const h = await headers();

  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = h.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = h.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "unknown";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24h
    updateAge: 60,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      }

      return true;
    },

    async jwt({ token, user }) {
      // Initial login
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.verified = (user as any).verified;
        return token;
      }

      // Re-check DB on refresh
      if (token?.uid) {
        const dbUser = await prisma.user.findFirst({
          where: {
            id: token.uid as string,
            deletedAt: null,
          },
          select: {
            id: true,
            role: true,
            verified: true,
          },
        });

        if (!dbUser) {
          return {};
        }

        token.role = dbUser.role;
        token.verified = dbUser.verified;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token?.uid) {
        session.user.id = token.uid as string;
        session.user.role = token.role as any;
        (session.user as any).verified = token.verified as boolean;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        verificationLogin: { label: "Verification", type: "text" },
      },

      async authorize(credentials) {
        try {
          const ip = await getIpFromNextHeaders();

          const email =
            credentials?.email?.toString().toLowerCase().trim() ?? "";
          const password =
            credentials?.password?.toString() ?? "";

          const verificationLogin =
            credentials?.verificationLogin === "true";

          if (!email) return null;

          await rateLimitOrThrow(`login-ip:${ip}`, limits.loginIp);
          await rateLimitOrThrow(`login:${email}:${ip}`, limits.loginEmail);

          const user = await prisma.user.findFirst({
            where: {
              email,
              deletedAt: null,
            },
          });

          if (!user) {
            await sleep(350);
            return null;
          }

          // Skip password check for verification login
          if (!verificationLogin) {
            if (!password) return null;

            const ok = await bcrypt.compare(password, user.password);

            if (!ok) {
              await sleep(350);
              return null;
            }

            // 🚫 Block unverified users
            if (!user.verified) {
              throw new Error("EMAIL_NOT_VERIFIED");
            }
          }

          const authUser: User = {
            id: user.id,
            email: user.email,
            role: user.role,
            verified: user.verified,
          };

          return authUser;
        }catch (err: any) {
        // Preserve explicit auth errors like EMAIL_NOT_VERIFIED
          if (err instanceof Error) {
            throw err;
          }

          return null;
        }
      },
    }),
  ],
});