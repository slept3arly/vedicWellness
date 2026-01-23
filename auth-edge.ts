import NextAuth from "next-auth";

export const { auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: process.env.NODE_ENV !== "production",

  // ✅ required by next-auth beta.30 types
  providers: [],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ ensure token has role/uid
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    // ✅ ensure session.user has role/id
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).role = token.role;
      }
      return session;
    },

    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && (auth?.user as any)?.role === "ADMIN";
      }

      return true;
    },
  },
});
