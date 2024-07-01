"use server";

import * as z from "zod";
import bcrypt from 'bcryptjs';

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export async function settings(values: z.infer<typeof SettingsSchema>) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  };

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  };

  // OAuth login provider automatically handle the following form fields. Cannot allow these to be changed manualy.
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // Verify if new email is already registered in a database user. 
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser) {
      return { error: "Email already in use" }
    }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(verificationToken.token, verificationToken.email);

    return { success: "Verification email sent" }
  }

  // Verify if new password is already registered in a database user.
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
    if (!passwordMatch) {
      return { error: "Invalid password" }
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;

    await db.user.update({
      where: { id: dbUser.id },
      data: { ...values }
    })
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  })

  return { success: "Settins Updated!" }
};
