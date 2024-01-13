import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";

export const generateVerificationtoken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Num of miliseconds in 1h -> expire token in 1hour from now*

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires
    },
  });

  return verificationToken;
}