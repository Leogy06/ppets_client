"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "@/lib/api/notificationApi";
import { Spinner } from "@/components/ui/spinner";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/app/(hooks)/webSocketHook";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Notification, Read } from "@/types";

const TransactionNotifications = () => {
  const socket = useSocket();
  const [take, setTake] = useState(5);
  const [open, setOpen] = useState(false);

  //for dynamic notification
  const [notifIdsRead, setNotifIdsRead] = useState<string[]>([]);
  const [notificationState, setNotificationState] = useState<Notification[]>(
    []
  );

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
              notifIdsRead?.includes(n.id) ? { ...n, read: Read.READ } : n // update notificaiton with id
          );
        });

        //empty id notificaiton state
        setNotifIdsRead([]);
      }
    };

    updateNotifications();
  }, [open]);

  //socket emit
  useEffect(() => {
    if (!socket) return;

    const handleSocketReceiveNotif = (event: Notification) => {
      setNotificationState((prevNotifs) => [...prevNotifs, event]);
    };

    socket.on("receiveNotification", handleSocketReceiveNotif);

    return () => {
      socket.off("receiveNotification", handleSocketReceiveNotif);
    };
  }, [socket]);

  const handleReadNotifications = async (notificationIds: string[]) => {
    setOpen(true);

    try {
      await readNotifications(notificationIds).unwrap();

      setNotifIdsRead(notificationIds);
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
        <Button
          disabled={isNotificationLoading}
          variant={"ghost"}
          className="relative"
        >
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
        {notificationState?.length <= 0 ? (
          <span className="px-4 py-2">--No Notification--</span>
        ) : (
          notificationState?.map((item) => (
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
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionNotifications;
