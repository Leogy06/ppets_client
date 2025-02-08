"use client";

import React from "react";
import Topbar from "@/app/admin/(components)/topbar";
import Sidebar from "@/app/admin/(components)/sidebar";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Topbar />
      <Sidebar />
      <div className="p-4 flex flex-col">{children}</div>
    </>
  );
};

export default AdminPageLayout;
