"use server";

import { signOut } from "@/auth";

// this can be used in case you want to do any server changes before logout
export const logout = async () => {
  // some server changes

  await signOut();
};