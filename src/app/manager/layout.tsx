"use client";
import React, { useEffect } from "react";
import PageHeader from "@/app/(component)/pageheader";
import Topbar from "@/app/(component)/topbar";
import { useRouter } from "next/navigation";
import { useCheckUserQuery } from "@/features/api/apiSlice";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useCheckUserQuery({});
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!data || data.role !== 2)) {
      router.push("/");
    }
  }, [data]);

  return isLoading ? (
    <div className="animate-pulse">Loading...</div>
  ) : (
    <>
      <Topbar />
      <PageHeader pageHead="Property Custodian" />
      <div className="p-4 flex flex-col">{children}</div>
    </>
  );
};

export default ManagerLayout;
