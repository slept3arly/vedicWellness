import type { DefaultSession } from "next-auth";

export type Role = "ADMIN" | "SALES" | "VIEWER";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      verified: boolean;
    };
  }

  interface User {
    id: string;
    role: Role;
    verified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    role: Role;
    verified: boolean;
  }
}
