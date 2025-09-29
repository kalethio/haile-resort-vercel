import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// 1️⃣ Extend the NextAuth types globally
declare module "next-auth" {
  interface User extends DefaultUser {
    role: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// 2️⃣ Auth options
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "1234"
        ) {
          return { id: "1", name: "Admin", role: "admin" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // 3️⃣ JWT callback
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    // 4️⃣ Session callback
    async session({ session, token }) {
      session.user.role = token.role ?? "";
      return session;
    },
  },
};

export default NextAuth(authOptions);
