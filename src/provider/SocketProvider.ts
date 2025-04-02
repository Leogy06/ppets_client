import { useAuth } from "@/context/AuthContext";
import { socket } from "@/hooks/useSocket";
import { useEffect } from "react";

const SocketProvider = () => {
  const { empDetails } = useAuth();

  useEffect(() => {
    if (socket.connected && empDetails?.ID) {
      socket.emit("registerUser", empDetails.ID);
      console.log(`📩 Sent registerUser for ${empDetails.ID}`);
    }

    return () => {
      socket.off("connect");
    };
  }, [empDetails?.ID]);
  return null;
};

export default SocketProvider;
