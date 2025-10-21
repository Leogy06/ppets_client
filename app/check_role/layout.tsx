"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CheckUserRole = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("role");
  const router = useRouter();

  useEffect(() => {
    if (role && role === "1") {
      router.push("/admin");

      return;
    }

    if (role && role === "2") {
      router.push("/employee");

      return;
    }
    localStorage.removeItem("role");
    router.push("/login");
  }, []);

  return <div className="flex items-center justify-center">{children}</div>;
};

export default CheckUserRole;
