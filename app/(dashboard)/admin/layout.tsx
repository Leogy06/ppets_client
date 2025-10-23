import AdminHeader from "@/app/(components)/AdminNavigation";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
};

export default AdminLayout;
