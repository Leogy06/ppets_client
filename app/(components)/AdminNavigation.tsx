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
import { useLogoutMutation } from "@/lib/api/authApi";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSocket } from "../(hooks)/webSocketHook";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/lib/api/notificationApi";
import { Notification, Read } from "@/types";
import { useRouterTransition } from "../(hooks)/routerTransition";

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
        <MenuBar />

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
        <div className="flex flex-row items-center gap-2">
          {/* You can later add: <UserDropdown /> here */}
          <NavigationComponent />
          <NotificationBar />
          <ModeToggle />
          <AvatarDropdown logout={handleLogout} isLoading={isLogoutLoading} />
        </div>
      </div>
    </header>
  );
};

//menu for mobile
function MenuBar() {
  const { isPending, push } = useRouterTransition();
  const pathName = usePathname();

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

  const { isPending, push } = useRouterTransition();

  return (
    <div className="hidden md:flex items-center">
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
          <Button variant={"ghost"}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

function NotificationBar() {
  const socket = useSocket();
  const [take, setTake] = useState(5);
  const [open, setOpen] = useState(false);

  //for dynamic notification
  const [idsNotification, setIdsNotification] = useState<string[]>();
  const [notificationState, setNotificationState] = useState<Notification[]>();

  //use get notification rtk api
  const { data: notifications, isLoading: isNotificationLoading } =
    useGetNotificationQuery(take);

  //read notification
  const [readNotifications] = useReadNotificationMutation();

  //absorb the notificaiton
  useEffect(() => {
    if (notifications) {
      setNotificationState(notifications);
    }
  }, [notifications]);

  //update read notification status upon closing the notif
  useEffect(() => {
    //upon closing the notification drop down
    // we update the notificaiton read status
    const updateNotifications = () => {
      if (!open) {
        // if notification close, this where we update the read state of the notification
        setNotificationState((prev) => {
          return prev?.map(
            (n) =>
              idsNotification?.includes(n.id) ? { ...n, read: Read.READ } : n // update notificaiton with id
          );
        });

        //empty id notificaiton state
        setIdsNotification([]);
      }
    };

    updateNotifications();
  }, [open]);

  const handleReadNotifications = async (notificationIds: string[]) => {
    setOpen(true);

    try {
      await readNotifications(notificationIds).unwrap();

      setIdsNotification(notificationIds);
    } catch (error) {
      console.error("Unable to read notification: ", error);
    }
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) {
          handleReadNotifications(
            notifications
              ?.filter((n) => n.read === "UNREAD")
              .map((n) => n.id) || []
          );
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="relative">
          {notificationState?.some((i) => i.read === "UNREAD") && (
            <span
              className="absolute -top-1 -right-1
            flex items-center justify-center
            w-5 h-5
            bg-red-500 text-white
            text-[10px] font-medium
            rounded-full"
            >
              {notificationState?.filter((i) => i.read === "UNREAD").length}
            </span>
          )}
          <Bell className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel asChild>
          <h3 className="text-center">Notifications</h3>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificationState?.map((item) => (
          <DropdownMenuItem asChild key={item.id}>
            <p
              className={`px-4 py-2 ${
                item.read === "READ"
                  ? "text-muted-foreground"
                  : "text-foreground font-semibold bg-muted"
              }`}
            >
              {" "}
              {item.message}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminHeader;
