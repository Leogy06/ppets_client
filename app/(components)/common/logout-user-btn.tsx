import { useLoading } from "@/app/(context)/LoadingContext";
import { Button } from "@/components/ui/button";
import { accountCodeApi } from "@/lib/api/accountCodeApi";
import { useLogoutMutation } from "@/lib/api/authApi";
import { employeeApi } from "@/lib/api/employeeApi";
import { itemsApi } from "@/lib/api/itemsApi";
import { notificationApi } from "@/lib/api/notificationApi";
import { transactionApi } from "@/lib/api/transactionApi";
import { userApi } from "@/lib/api/userApi";
import { logout } from "@/lib/features/auth/authSlice";
import { persistor } from "@/lib/store";
import { LogOut } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

const LogoutUser = () => {
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();
  const { push } = useLoading();

  const handleLogoutUser = async () => {
    dispatch(logout()); // clear in local storage

    //clear reset api cached
    dispatch(employeeApi.util.resetApiState());
    dispatch(itemsApi.util.resetApiState());
    dispatch(notificationApi.util.resetApiState());
    dispatch(transactionApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
    dispatch(accountCodeApi.util.resetApiState());

    //
    await logoutUser(); // clear token in the http-cookie
    await persistor.purge(); // clears persis in redux
    localStorage.clear(); //optional but clears everything inside local storage browser
    push("/login");
  };

  return (
    <Button className="w-full" variant={"ghost"} onClick={handleLogoutUser}>
      <LogOut />
      Logout
    </Button>
  );
};

export default LogoutUser;
