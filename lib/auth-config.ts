// lib/auth-config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              role: { include: { permissions: true } },
              branch: true,
            },
          });

          if (!user || user.status !== "ACTIVE") return null;

          let isValidPassword = false;
          if (user.password?.startsWith("$2b$10$HASHED_")) {
            const plainPassword = user.password.replace("$2b$10$HASHED_", "");
            isValidPassword = credentials.password === plainPassword;
          } else if (user.password) {
            isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );
          }

          if (!isValidPassword) return null;

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role?.name || "USER",
            permissions: user.role?.permissions || [],
            branch: user.branch
              ? {
                  id: user.branch.id,
                  name: user.branch.branchName,
                  slug: user.branch.slug,
                }
              : null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
        token.branch = user.branch;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.role = token.role;
      session.user.permissions = token.permissions;
      session.user.branch = token.branch;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
