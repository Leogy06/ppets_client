import { useLogoutMutation } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";
import React from "react";

const ErrorExtractor = ({
  mainMsg,
  arrayMsg,
}: {
  mainMsg: { data: { message: string } };
  arrayMsg: { message: string }[];
}) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const logoutUser = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
      return "Session expired, please login again.";
    } catch (error) {
      console.error("Unable to logout. ", error);
    }
  };

  if (mainMsg && mainMsg.data.message === "Unauthorized") {
    logoutUser();
  }

  return (
    <div className="flex flex-col">
      <h3>{mainMsg.data.message ?? "Unknown Errors"}</h3>
      {arrayMsg
        ? arrayMsg.map((err) => <div key={err.message}>{err.message}</div>)
        : "--Nothing follows--"}
    </div>
  );
};

export default ErrorExtractor;
