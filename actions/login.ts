'use server';

import * as z from "zod";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

import { getUserByEmail } from "@/data/user";
import { generateVerificationtoken } from "@/lib/tokens";
import { sendVerification } from "@/lib/mail";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email or password incorrect!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationtoken(existingUser.email);
    await sendVerification(verificationToken.email, verificationToken.token);
    return { success: 'Confirmation email sent!'}
  }




  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' }
        default:
          return { error: 'Something went wrong!' }
      }
    }

    throw error;
  }
};