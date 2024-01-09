'use client'

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

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
      <span onClick={onClick} className="cursor-pointer">
        TODO: Implement modal
      </span>
    )
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}