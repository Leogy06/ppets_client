"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSocket } from "../(hooks)/webSocketHook";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/lib/api/notificationApi";
import { Notification, Read } from "@/types";
import { useLoading } from "../(context)/LoadingContext";
import UserAvatar from "./common/user-avatar";
import TransactionNotifications from "./common/notification-transaction";

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
  return (
    <header className="sticky top-0 z-50 w-full bg-accent/50 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        {/* 📱 Menu button (visible only on mobile) */}
        <MenuBar />

        {/* 🏛️ Logo + System name */}
        <div className=" items-center gap-3 hidden lg:flex">
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
        <div className="flex flex-row items-center gap-2">
          {/* You can later add: <UserDropdown /> here */}
          <NavigationComponent />
          <UserAvatar />
          <TransactionNotifications />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

//menu for mobile
function MenuBar() {
  const { isPending, push } = useLoading();
  const pathName = usePathname();

  return (
    <div className="block lg:hidden">
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
                onClick={() => push(page.path)}
                variant={"link"}
                className={` w-full ${pathName === page.path && "underline"}`}
                disabled={isPending}
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

//for large width screends navigation
function NavigationComponent() {
  const pathname = usePathname();

  const { isPending, push } = useLoading();

  return (
    <div className="hidden lg:flex items-center overflow-x-auto">
      {pathPages.map((page) => (
        <Button
          key={page.name}
          onClick={() => push(page.path)}
          disabled={isPending}
          variant={"link"}
          className={`${pathname === page.path ? "underline" : ""}`}
        >
          {page.name}
        </Button>
      ))}
    </div>
  );
}

export default AdminHeader;
