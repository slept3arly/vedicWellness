import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 60 * 10,
    updateAge: 60,
  },

  jwt: {
    maxAge: 60 * 10,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    /**
     * ✅ This runs in middleware (Edge).
     * Keep it lightweight: no DB calls.
     */
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // protect admin routes
      if (pathname.startsWith("/admin")) return isLoggedIn;

      return true;
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
          const email = credentials?.email?.toString().toLowerCase().trim();
          const password = credentials?.password?.toString();

          if (!email || !password) return null;

          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
          if (!adminEmail) return null;

          if (email !== adminEmail) return null;

          const user = await prisma.user.findFirst({ where: { email } });
          if (!user) return null;

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;

          return { id: user.id, email: user.email };
        } catch {
          return null;
        }
      },
    }),
  ],
});
