"use client";

import React, { useEffect } from "react";
import Topbar from "@/app/admin/(components)/topbar";
import Sidebar from "@/app/admin/(components)/sidebar";
import { useCheckUserQuery } from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isError } = useCheckUserQuery({});
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error fetching data...</div>;
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
