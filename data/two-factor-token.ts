import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twofactorToken = await db.twoFactorToken.findUnique({ where: { token } });
    return twofactorToken;
  } catch (error) {
    return null;
  }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twofactorToken = await db.twoFactorToken.findFirst({ where: { email } });
    return twofactorToken;
  } catch (error) {
    return null;
  }
}