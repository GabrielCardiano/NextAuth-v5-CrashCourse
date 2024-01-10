import { db } from "@/lib/db";

// * Database requisitions should be made inside a try/catch

export const getUserByEmail = async (email: string) => db.user.findUnique({ where: { email } });
export const getUserById = async (id: string) => db.user.findUnique({ where: { id } });