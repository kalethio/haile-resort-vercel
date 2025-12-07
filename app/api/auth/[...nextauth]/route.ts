// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // ✅ TEMPORARY: Allow superadmin without password check
        if (credentials.email === "superadmin@haileresorts.com") {
          console.log("⚠️ TEMPORARY: Superadmin login (no password check)");
          return {
            id: "0",
            email: "superadmin@haileresorts.com",
            name: "Super Admin",
            role: "SUPER_ADMIN",
            permissions: [{ id: 0, module: "*", action: "*" }],
            branch: null,
          };
        }

        // For all other users, return null (temporary)
        console.log("Temporary: Only superadmin allowed");
        return null;
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
      session.user.id = token.sub || "";
      session.user.role = token.role;
      session.user.permissions = token.permissions;
      session.user.branch = token.branch;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET || "temporary-secret-for-dev",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
