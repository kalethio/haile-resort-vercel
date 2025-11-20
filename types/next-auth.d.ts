// types/next-auth.d.ts (create this file in root types folder)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      permissions: Array<{
        id: number;
        module: string;
        action: string;
      }>;
      branch?: {
        id: number;
        name: string;
        slug: string;
      };
    };
  }

  interface User {
    role: string;
    permissions: Array<{
      id: number;
      module: string;
      action: string;
    }>;
    branch?: {
      id: number;
      name: string;
      slug: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    permissions: Array<{
      id: number;
      module: string;
      action: string;
    }>;
    branch?: {
      id: number;
      name: string;
      slug: string;
    };
  }
}
