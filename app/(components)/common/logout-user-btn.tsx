import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/lib/api/authApi";
import { logout } from "@/lib/features/auth/authSlice";
import { persistor } from "@/lib/store";
import { LogOut } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

const LogoutUser = () => {
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();

  const handleLogoutUser = async () => {
    dispatch(logout()); // clear in local storage
    await logoutUser(); // clear token in the http-cookie
    await persistor.purge(); // clears persis in redux
    localStorage.clear(); //optional but clears everything inside local storage browser
    window.location.href = "/login";
  };

  return (
    <Button className="w-full" variant={"ghost"} onClick={handleLogoutUser}>
      <LogOut />
      Logout
    </Button>
  );
};

export default LogoutUser;
