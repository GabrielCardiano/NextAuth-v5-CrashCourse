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
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";

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

      const exististingUser = await getUserById(user.id);

      // Block sign in for 'credential' login without email verification
      if (!exististingUser?.emailVerified) return false;

      // Check 2FA confirmation
      if (exististingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(exististingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in.
        // Obs: Deleting manualy. We can also delete using expireAt in the schema. 
        await db.twoFactorConfirmation.delete({ where: { id: twoFactorConfirmation.id } });
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }


      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      const exististingUser = await getUserById(token.sub);
      if (!exististingUser) return token;

      const existingAccount = await getAccountByUserId(exististingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = exististingUser.name;
      token.email = exististingUser.email
      token.role = exististingUser.role;
      token.isTwoFactorEnabled = exististingUser.isTwoFactorEnabled;

      return token;
    }
  },

  adapter: PrismaAdapter(db),

  session: { strategy: "jwt" }, // database strategy when using Prisma does not work on the Edge. Must use jwt strategy.

  ...authConfig,
})