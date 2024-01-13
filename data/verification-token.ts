import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => await db.verificationToken.findFirst({ where: { email } });

export const getVerificationTokenByToken = async (token: string) => await db.verificationToken.findUnique({ where: { token } });
