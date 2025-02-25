"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useAuth } from "@/context/AuthContext";
import { Paper } from "@mui/material";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  //auth context
  const { user, isLoading } = useAuth();

  //check if already login
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 1)) {
      router.push("/");
    }
  }, [user, router, isLoading, openSnackbar]);

  return (
    <>
      {isLoading ? (
        <div className="animate-pulse">Loading...</div>
      ) : (
        <Paper className="p-4 flex flex-col">{children}</Paper>
      )}
    </>
  );
};

export default AdminPageLayout;
