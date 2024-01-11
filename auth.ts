/**dapter is
 * * Prisma database is not supported at the Edge
 * * Middleware runs at the Edge --> thus can't use Prisma in middleware
 * * File auth-config.ts will trigger the middleware insted auth
*/

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "./lib/db";
import authConfig from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" }, // database strategy when using Prisma does not work on the Edge. Must use jwt.
  ...authConfig,
})