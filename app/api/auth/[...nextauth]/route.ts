// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ------------------ Type Declarations ------------------
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

// ------------------ Auth Options ------------------
const authOptions = {
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
          // Find user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              role: { include: { permissions: true } },
              branch: true,
            },
          });

          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          // Check if user is active
          if (user.status !== "ACTIVE") {
            throw new Error("Account is inactive or suspended");
          }

          // Password verification logic
          let isValidPassword = false;

          if (user.password?.startsWith("$2b$10$HASHED_")) {
            // Placeholder seeded password
            const plainPassword = user.password.replace("$2b$10$HASHED_", "");
            isValidPassword = credentials.password === plainPassword;
          } else if (user.password) {
            // Real bcrypt hash verification
            isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );
          }

          if (!isValidPassword) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("✅ Successful login for:", credentials.email);

          // Return minimal session user
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ------------------ Exports ------------------
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
