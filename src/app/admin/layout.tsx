"use client";

import React from "react";
import Topbar from "@/app/admin/(components)/topbar";
import Sidebar from "@/app/admin/(components)/sidebar";
import { useCheckUserQuery } from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  //redirect to login if user has no token and role is not

  const { isLoading, isError } = useCheckUserQuery({});
  const router = useRouter();

  if (isError) {
    router.push("/");
    return <div className="text-red-500">Error fetching data...</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Topbar />
      <Sidebar />
      <div className="p-4 flex flex-col overflow-auto">{children}</div>
    </>
  );
};

export default AdminPageLayout;
