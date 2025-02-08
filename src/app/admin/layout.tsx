"use client";

import React from "react";
import Topbar from "@/app/admin/(components)/topbar";
import Sidebar from "@/app/admin/(components)/sidebar";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Topbar />
      <Sidebar />
      {children}
    </div>
  );
};

export default AdminDashboardLayout;
