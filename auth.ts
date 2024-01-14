/**dapter is
 * * Prisma database is not supported at the Edge
 * * Middleware runs at the Edge --> thus can't use Prisma in middleware
 * * File auth-config.ts will trigger the middleware insted auth
*/

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "./lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }
  },

  callbacks: {
    async signIn({ user, account }) {
      // Allow any OAuth login (google/github)
      if (account?.provider !== 'credentials') return true;

      // Block sign in for 'credential' login without email verification
      const exististingUser = await getUserById(user.id);
      if (!exististingUser?.emailVerified) return false; 

      // TODO: Add 2FA check
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      const exististingUser = await getUserById(token.sub);
      if (!exististingUser) return token;

      token.role = exististingUser.role;

      return token;
    }
  },

  adapter: PrismaAdapter(db),

  session: { strategy: "jwt" }, // database strategy when using Prisma does not work on the Edge. Must use jwt strategy.

  ...authConfig,
})