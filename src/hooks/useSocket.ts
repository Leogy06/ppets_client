import { Employee } from "@/types/global_types";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log(`✅ Connected to server with ID: ${socket.id}`);
});

const useSocket = (userId: Employee["ID"], onNotification: () => void) => {
  useEffect(() => {
    if (!userId) return;

    //register employee id to socket user
    socket.emit("registerUser", userId);

    socket.on("newTransactionNotification", onNotification);

    return () => {
      socket.off("newTransactionNotification", onNotification);
    };
  }, [userId, onNotification]);
};

export default useSocket;
