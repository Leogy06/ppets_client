"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Spinner } from "@/components/ui/spinner";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";

const pathPages = [
  { path: "/admin", name: "Overview" },
  { path: "/admin/asset_management", name: "Asset Management" },
  { path: "/admin/request", name: "Requests" },
  { path: "/admin/users", name: "Users" },
  { path: "/admin/activity_log", name: "Activity Log" },
];

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-accent/50 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        {/* 📱 Menu button (visible only on mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu size={24} />
        </Button>

        {/* 🏛️ Logo + System name */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14">
            <Image
              src="/logo.png"
              alt="PPETS logo"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>
          <h3 className="hidden md:block text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            Property, Plant & Equipment
            <br />
            <span className="text-sm font-normal text-muted-foreground">
              Tracking System
            </span>
          </h3>
        </div>

        {/* 🌗 Theme toggle + (future user menu placeholder) */}
        <div className="flex items-center gap-2">
          {/* You can later add: <UserDropdown /> here */}
          <NavigationComponent />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export function NavigationComponent() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentPage =
    [...pathPages]
      .sort((a, b) => b.path.length - a.path.length)
      .find((page) => pathname.startsWith(page.path))?.name || "Menu";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="capitalize">
            {isPending ? (
              <Button variant={"ghost"} disabled size={"sm"}>
                <Spinner />
                Please wait
              </Button>
            ) : (
              currentPage
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {pathPages.map((page) => (
              <NavigationMenuLink asChild key={page.name}>
                <Button
                  onClick={() => startTransition(() => router.push(page.path))}
                  variant={"ghost"}
                >
                  {page.name}
                </Button>
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default AdminHeader;
