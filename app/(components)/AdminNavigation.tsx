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
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/lib/api/authApi";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface PathPage {
  path: string;
  name: string;
}

const pathPages: PathPage[] = [
  { path: "/admin", name: "Overview" },
  { path: "/admin/asset_management", name: "Asset Management" },
  { path: "/admin/request", name: "Requests" },
  { path: "/admin/users", name: "Users" },
  { path: "/admin/activity_log", name: "Activity Log" },
];

const AdminHeader = () => {
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Unable to logout.", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-accent/50 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        {/* 📱 Menu button (visible only on mobile) */}
        <MenuBar router={router} />

        {/* 🏛️ Logo + System name */}
        <div className=" items-center gap-3 hidden md:flex">
          <div className="relative w-12 h-12 border">
            <Image
              src="/logo.png"
              alt="PPETS logo"
              fill
              className="object-contain rounded-full"
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className=" md:block text-lg sm:text-xl font-semibold tracking-tight text-foreground">
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
          <AvatarDropdown logout={handleLogout} isLoading={isLogoutLoading} />
        </div>
      </div>
    </header>
  );
};

//menu
function MenuBar({ router }: { router: AppRouterInstance }) {
  const handleNavigate = (pagePath: string) => {
    router.push(pagePath);
  };

  return (
    <div className="block md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Navigate</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col">
            {pathPages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigate(page.path)}
                variant={"ghost"}
              >
                {page.name}
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function NavigationComponent() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentPage =
    [...pathPages]
      .sort((a, b) => b.path.length - a.path.length)
      .find((page) => pathname.startsWith(page.path))?.name || "Menu";

  return (
    <div className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="capitalize">
              {isPending ? (
                <div className="flex items-center text-muted-foreground gap-2">
                  <Spinner />
                  Please wait
                </div>
              ) : (
                currentPage
              )}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {pathPages.map((page) => (
                <NavigationMenuLink asChild key={page.name}>
                  <Button
                    onClick={() =>
                      startTransition(() => router.push(page.path))
                    }
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
    </div>
  );
}

function AvatarDropdown({
  logout,
  isLoading,
}: {
  logout: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={logout}>
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AdminHeader;
