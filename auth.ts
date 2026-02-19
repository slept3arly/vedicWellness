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
    maxAge: 60 * 10,
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

    // ⭐ FINAL JWT CALLBACK (SESSION REVALIDATION)
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        return token;
      }

      // Re-check DB on every refresh
      if (token?.uid) {
        const dbUser = await prisma.user.findFirst({
          where: {
            id: token.uid as string,
            deletedAt: null,
          },
          select: {
            id: true,
            role: true,
          },
        });

        // If deleted → kill session
        if (!dbUser) {
          return {};
        }

        token.role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      // If jwt() cleared token → session becomes null automatically
      if (session.user && token?.uid) {
        session.user.id = token.uid as string;
        session.user.role = token.role as any;
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
      },

      async authorize(credentials) {
        try {
          const ip = await getIpFromNextHeaders();

          const email =
            credentials?.email?.toString().toLowerCase().trim() ?? "";
          const password =
            credentials?.password?.toString() ?? "";

          if (!email || !password) return null;

          await rateLimitOrThrow(`login-ip:${ip}`, limits.loginIp);
          await rateLimitOrThrow(`login:${email}:${ip}`, limits.loginEmail);

          // ⭐ block deleted users
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

          const ok = await bcrypt.compare(password, user.password);

          if (!ok) {
            await sleep(350);
            return null;
          }

          const authUser: User = {
            id: user.id,
            email: user.email,
            role: user.role,
            verified: user.verified,
          };

          return authUser;
        } catch (err: any) {
          if (err?.message === "RATE_LIMITED") {
            console.log("LOGIN RATE LIMITED", {
              ip: await getIpFromNextHeaders(),
            });
          }
          return null;
        }
      },
    }),
  ],
});
