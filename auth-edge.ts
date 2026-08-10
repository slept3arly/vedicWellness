import NextAuth from "next-auth";
import type { Role } from "@/types/next-auth";

export const { auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  providers: [],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.verified = user.verified;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as Role;
        session.user.verified = token.verified as boolean;
      }
      return session;
    },
  },
});
