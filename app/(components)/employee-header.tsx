"use client";

import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { Bell, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetNotificationQuery } from "@/lib/api/notificationApi";
import { Spinner } from "@/components/ui/spinner";
import UserAvatar from "./common/user-avatar";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePathname } from "next/navigation";
import { useRouterTransition } from "../(hooks)/routerTransition";

const EmployeeHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-accent/50 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        {/* 📱 Menu button (visible only on mobile) */}
        <NavigationDrawer />
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
        <NavigationPage />
        {/* 🌗 Theme toggle + (future user menu placeholder) */}
        <div className="flex items-center gap-2">
          {/* You can later add: <UserDropdown /> here */}
          <UserAvatar />
          <Notification />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

function Notification() {
  const [take, setTake] = useState(5);
  const { data: notifications, isLoading: isNotificationLoading } =
    useGetNotificationQuery(take);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="relative">
          {notifications?.some((n) => n.read === "UNREAD") && (
            <span className=" absolute -top-1 -right-1 rounded-full w-5 h-5 text-white bg-red-500">
              {notifications?.filter((item) => item.read === "UNREAD").length}
            </span>
          )}
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-center font-bold">
          {isNotificationLoading ? <Spinner /> : "Notification"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {notifications?.length === 0 ? (
          <DropdownMenuItem asChild>
            <h3 className="text-center font-bold text-muted-foreground">
              --No notifications--
            </h3>
          </DropdownMenuItem>
        ) : (
          notifications?.map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <p
                className={`${
                  item.read === "UNREAD"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {item.message}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const pages = [
  { path: "/employee", name: "Assets" },
  { path: "/employee/request-asset", name: "Request Asset" },
  { path: "/employee/request", name: "Requests" },
];

function NavigationDrawer() {
  const { push, isPending } = useRouterTransition();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={"icon-sm"} variant={"ghost"} className="block md:hidden">
          <MenuIcon size={36} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select page to navigate</DrawerTitle>
          <DrawerDescription>
            Clicking the page will navigate thru that page.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col">
          {pages.map((p, i) => (
            <Button
              disabled={isPending}
              onClick={() => push(p.path)}
              key={i}
              variant={"ghost"}
            >
              {p.name}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NavigationPage() {
  const path = usePathname();
  const { isPending, push } = useRouterTransition();
  return (
    <div className="hidden md:flex items-center gap-4">
      {pages.map((p) => (
        <Button
          variant={`${path === p.path ? "default" : "ghost"}`}
          disabled={isPending}
          key={p.path}
          onClick={() => push(p.path)}
        >
          {p.name}
        </Button>
      ))}
    </div>
  );
}

export default EmployeeHeader;
