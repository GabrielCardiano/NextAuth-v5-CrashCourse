'use client'

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";

interface LogintButtonProps {
  children: ReactNode,
  mode?: "modal" | "redirect",
  asChild?: boolean,
}

export function LoginButton(btnProps: LogintButtonProps) {
  const { children, mode = 'redirect', asChild } = btnProps;
  const router = useRouter();

  const onClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}