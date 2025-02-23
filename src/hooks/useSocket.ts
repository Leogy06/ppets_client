import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log(`✅ Connected to server with ID: ${socket.id}`);
});
