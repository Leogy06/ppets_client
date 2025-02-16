"use client";

import { useAuth } from "@/context/AuthContext";
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
  return <>{children}</>;
};

export default EmployeePageLayout;
