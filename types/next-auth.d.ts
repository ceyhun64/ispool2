// next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Prisma modelinizdeki UserRole enum'unun string karşılıkları
type CustomUserRole = "ADMIN" | "USER" | "EDITOR";

// 1. NextAuth'a (authorize'dan dönen objeyi) genişlet
declare module "next-auth" {
  interface User extends DefaultUser {
    // authorize'dan string olarak dönüyor
    id: string;
    surname: string;
    role: CustomUserRole;
  }

  // 2. Session objesini genişlet
  interface Session extends DefaultSession {
    user: {
      id: string; // token.id'den gelir ve string'dir
      surname: string;
      role: CustomUserRole;
    } & DefaultSession["user"];
  }
}

// 3. JWT (Token) objesini genişlet
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string; // user.id'den gelir ve string'dir
    surname: string;
    role: CustomUserRole;
  }
}
