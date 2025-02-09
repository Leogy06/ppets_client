"use client";

import React, { useEffect } from "react";
import Topbar from "@/app/admin/(components)/topbar";
import Sidebar from "@/app/admin/(components)/sidebar";
import { useCheckUserQuery, useLogoutMutation } from "@/features/api/apiSlice";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useRouter } from "next/navigation";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  //redirect to login if user has no token and role is not
  const router = useRouter();
  const { data, isLoading, isError } = useCheckUserQuery({});
  const { openSnackbar } = useSnackbar();
  const [logout] = useLogoutMutation();

  //check if user is authorized
  useEffect(() => {
    if (isError || (data && data.user.role !== "1")) {
      logout({});
      router.push("/");
      openSnackbar("Login first", "info");
    }
  }, [isError, router, openSnackbar, logout, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Topbar />
      <Sidebar />
      <div className="p-4 flex flex-col">{children}</div>
    </>
  );
};

export default AdminPageLayout;
