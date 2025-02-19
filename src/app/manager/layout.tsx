"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Paper } from "@mui/material";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  //auth context
  const { isLoading, user } = useAuth();

  //redirect to login if not login
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 2)) {
      router.push("/");
    }
  }, [isLoading, router, user]);

  return <Paper className="p-4">{children}</Paper>;
};

export default ManagerLayout;
