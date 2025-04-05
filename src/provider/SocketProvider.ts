import { useAuth } from "@/context/AuthContext";
import { socket } from "@/hooks/useSocket";
import { useEffect } from "react";

const SocketProvider = () => {
  const { empDetails } = useAuth();

  useEffect(() => {
    // Register once socket is connected and user is available
    const handleConnect = () => {
      if (empDetails?.ID) {
        socket.emit("registerUser", empDetails.ID);
        console.log(`📩 Sent registerUser for ${empDetails.ID}`);
      }
    };

    // If already connected, emit right away
    if (socket.connected && empDetails?.ID) {
      handleConnect();
    }

    // Otherwise, wait for connection
    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("registerUser"); // optional cleanup
    };
  }, [empDetails?.ID]);

  return null;
};

export default SocketProvider;
