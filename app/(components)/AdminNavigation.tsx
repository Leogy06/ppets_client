import { ModeToggle } from "@/components/theme-toggle";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";

const AdminHeader = () => {
  return (
    <div className="flex flex-row justify-between px-6 py-2 bg-accent shadow">
      <h1>Logo</h1>
      <ModeToggle />
    </div>
  );
};

export function NavigationMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href="/docs">Documentation</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export default AdminHeader;
