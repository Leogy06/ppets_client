"use client";
import React, { useEffect } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { usePathname, useRouter } from "next/navigation";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useAuth } from "@/context/AuthContext";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openSnackbar } = useSnackbar();

  //auth context
  const { isLoading, user } = useAuth();

  //redirect to login if not login
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 2)) {
      router.push("/");
    }
  }, [isLoading, router, openSnackbar, user]);

  return isLoading ? (
    <div className="animate-pulse">Loading...</div>
  ) : (
    <>
      <PageHeader pageHead="Property Custodian" />{" "}
      {pathname === "/manager/lend_item" && (
        <PageHeader pageHead="Lend items" />
      )}
      <div className="p-4 flex flex-col">{children}</div>
    </>
  );
};

export default ManagerLayout;
