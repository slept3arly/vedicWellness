import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

type AppRole = "ADMIN" | "EDITOR" | "VIEWER";

type AppUser = {
  id: string;
  email: string;
  role: AppRole;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
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
          const email = credentials?.email?.toString().toLowerCase().trim();
          const password = credentials?.password?.toString();

          if (!email || !password) return null;

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;

          // ✅ must return role/id for jwt callback
          return {
            id: user.id,
            email: user.email,
            role: user.role as AppRole,
          } satisfies AppUser;
        } catch {
          return null;
        }
      },
    }),
  ],
});
