import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

import { headers } from "next/headers";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";

type AppRole = "ADMIN" | "EDITOR" | "VIEWER";

type AppUser = {
  id: string;
  email: string;
  role: AppRole;
};

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

  // ✅ safer: trust host only in dev
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 60 * 10, // 10 minutes
    updateAge: 60,
  },

  jwt: {
    maxAge: 60 * 10,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // ✅ Protect /admin (role-based)
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const u = user as AppUser;
        token.uid = u.id;
        token.role = u.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as AppRole;
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

          const email = credentials?.email?.toString().toLowerCase().trim() ?? "";
          const password = credentials?.password?.toString() ?? "";

          if (!email || !password) return null;

          // ✅ brute-force protection
          await rateLimitOrThrow(`login-ip:${ip}`, limits.loginIp);
          await rateLimitOrThrow(`login:${email}:${ip}`, limits.loginEmail);

          const user = await prisma.user.findUnique({ where: { email } });

          // ✅ slow down brute force a bit
          if (!user) {
            await sleep(350);
            return null;
          }

          const ok = await bcrypt.compare(password, user.password);

          if (!ok) {
            await sleep(350);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role as AppRole,
          } satisfies AppUser;
        } catch (err: any) {
            if (err?.message === "RATE_LIMITED") {
              console.log("LOGIN RATE LIMITED", { ip: await getIpFromNextHeaders() });
            }
            return null;
          }
      },
    }),
  ],
});
