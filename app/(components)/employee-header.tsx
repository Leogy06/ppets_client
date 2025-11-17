"use client";

import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useLoading } from "../(context)/LoadingContext";
import TransactionNotifications from "./common/notification-transaction";

const EmployeeHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-accent/50 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        {/* 📱 Menu button (visible only on mobile) */}
        <NavigationDrawer />
        {/* 🏛️ Logo + System name */}
        <div className=" items-center gap-3 hidden md:flex">
          <Image
            src="/logo.png"
            alt="PPETS logo"
            height={50}
            width={50}
            className=" rounded-full"
            unoptimized
            placeholder="blur"
            blurDataURL="/blur_logo.png"
            priority={false}
          />
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
          <TransactionNotifications />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

const pages = [
  { path: "/employee", name: "Assets" },
  { path: "/employee/request-asset", name: "Request Asset" },
  { path: "/employee/request", name: "Requests" },
];

//for mobile
function NavigationDrawer() {
  const { isPending, push } = useLoading();

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
  const { isPending, push } = useLoading();
  return (
    <div className="hidden md:flex items-center gap-3">
      {pages.map((p) => (
        <Button
          variant={"link"}
          disabled={isPending}
          className={`${path === p.path && "underline"}`}
          key={p.path}
          onClick={() => push(p.path)}
          size={"sm"}
        >
          {p.name}
        </Button>
      ))}
    </div>
  );
}

export default EmployeeHeader;
