"use client";

import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useLogoutMutation } from "@/lib/api/authApi";
import { useSocket } from "../(hooks)/webSocketHook";
import { Bell } from "lucide-react";
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
import { Notification as NotificationType } from "@/types";

const EmployeeHeader = () => {
  const socket = useSocket();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Unable to logout.", error);
    }
  };

  const handleSendAdminNotif = () => {
    if (!socket) return;

    socket.emit("send_admin_notif", {
      notification: "Hello admin!",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-accent/50 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 md:px-6">
        {/* 📱 Menu button (visible only on mobile) */}

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
        <DropdownMenuItem>
          {isNotificationLoading ? <Spinner /> : "Notification"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {notifications?.length === 0 ? (
          <DropdownMenuItem asChild>
            <h3>No notifications</h3>
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

export default EmployeeHeader;
