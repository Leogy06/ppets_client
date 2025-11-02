import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      const res = await fetch("/api/socket/token"); // fetch token

      const { token } = await res.json();
      if (!token) return;

      const socketIo = io(process.env.NEXT_PUBLIC_API_URL, {
        transports: ["websocket"],
        withCredentials: true,
        auth: { token },
      });

      setSocket(socketIo);
    };

    socket?.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return socket;
}
