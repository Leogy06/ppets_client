import AdminFooter from "@/app/(components)/AdminFooter";
import AdminHeader from "@/app/(components)/AdminNavigation";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminHeader />
      <main className="min-h-screen">{children}</main>
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
