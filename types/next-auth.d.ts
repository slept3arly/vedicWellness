import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: "ADMIN" | "EDITOR" | "VIEWER";
    };
  }

  interface User {
    role?: "ADMIN" | "EDITOR" | "VIEWER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: "ADMIN" | "EDITOR" | "VIEWER";
  }
}
