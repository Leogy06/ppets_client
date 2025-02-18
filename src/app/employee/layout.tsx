"use client";

import { useAuth } from "@/context/AuthContext";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EmployeePageLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  //redirect to login if not login
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 3)) {
      router.push("/");
    }
  }, [isLoading, router, user]);
  return <Paper className="p-4">{children}</Paper>;
};

export default EmployeePageLayout;
