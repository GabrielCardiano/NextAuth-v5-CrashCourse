"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import UserButton from "@/components/auth/user-button";

const Navbar = () => {
  const pathName = usePathname();

  return (
    <nav className="bg-secondary flex - justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button asChild variant={pathName === "/server" ? "default" : "outline"}>
          <Link href="/server">Server</Link>
        </Button>

        <Button asChild variant={pathName === "/client" ? "default" : "outline"}>
          <Link href="/client">Client</Link>
        </Button>

        <Button asChild variant={pathName === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>

        <Button
          asChild
          variant={pathName === "/settings" ? "default" : "secondary"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>

      <UserButton />
    </nav>
  );
};

export default Navbar;
