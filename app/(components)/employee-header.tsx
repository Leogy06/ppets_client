'use client'

import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useLogoutMutation } from "@/lib/api/authApi";
import { useSocket } from "../(hooks)/webSocketHook";

const EmployeeHeader = () => {
  const socket = useSocket()
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const router = useRouter();

  const [notifications, setNotifications] = useState([])

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Unable to logout.", error);
    }
  };

  const handleSendAdminNotif = () => { 

    if(!socket) return

    socket.emit("send_admin_notif", {
      notification:"Hello admin!"
    })
   }
  

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
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
