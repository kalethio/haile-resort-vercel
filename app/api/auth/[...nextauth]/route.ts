import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              role: {
                include: {
                  permissions: true,
                },
              },
              branch: true,
            },
          });

          // === DEBUG LOGGING ===
          console.log("=== DEBUG AUTH ===");
          console.log("Email:", credentials.email);
          console.log("Password entered:", credentials.password);
          console.log("Stored hash:", user?.password);
          console.log("Hash length:", user?.password?.length);
          console.log("User found:", !!user);
          // === END DEBUG ===

          // User not found
          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          // User has no password (shouldn't happen for normal users)
          if (!user.password) {
            console.log("User has no password:", credentials.email);
            return null;
          }

          // Compare password using bcrypt
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("bcrypt compare result:", isValid);

          if (!isValid) {
            console.log("Invalid password for:", credentials.email);
            return null;
          }

          // Check if user is active
          if (user.status !== "ACTIVE") {
            console.log("User not active:", credentials.email, user.status);
            return null;
          }

          // Return user object for session
          return {
            id: String(user.id),
            email: user.email,
            name: user.name || user.email,
            role: user.role?.name || "STAFF",
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
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.branch = user.branch;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as any[];
        session.user.branch = token.branch as any;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
