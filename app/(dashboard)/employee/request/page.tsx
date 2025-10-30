"use client";

import { useSocket } from "@/app/(hooks)/webSocketHook";
import { Button } from "@/components/ui/button";
import React from "react";

const EmployeeRequest = () => {
  const socket = useSocket();

  const handleSendNotif = () => {
    if (!socket) return;

    socket.emit("send_admin_notif", {
      notification: "hello admin from employee side.",
    });
  };
  return (
    <>
      <Button onClick={handleSendNotif}>Send admin notif</Button>
    </>
  );
};

export default EmployeeRequest;
