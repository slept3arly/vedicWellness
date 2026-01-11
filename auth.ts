import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
  strategy: "jwt",
  maxAge: 60 * 10, // 10 mins
  updateAge: 60,   // refresh token every 60 secs while active
},
jwt: {
  maxAge: 60 * 10,
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

          // Missing fields
          if (!email || !password) return null;

          // Only allow your admin email
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
          if (!adminEmail) {
            console.error("ADMIN_EMAIL env missing");
            return null;
          }

          if (email !== adminEmail) return null;

          const user = await prisma.user.findFirst({ where: { email } });
          if (!user) return null;

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;

          return { id: user.id, email: user.email };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
});
