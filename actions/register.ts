'use server';

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { sendVerification } from "@/lib/mail";
import { getUserByEmail } from "@/data/user";
import { generateVerificationtoken } from "@/lib/tokens";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  // Hash password
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Verify user
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use' }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    },
  });

  const verificationToken = await generateVerificationtoken(email);
  await sendVerification(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' }
};