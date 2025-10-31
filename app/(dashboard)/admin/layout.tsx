import AdminHeader from "@/app/(components)/AdminNavigation";
import React from "react";
import Footer from "@/app/(components)/footer";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminHeader />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default AdminLayout;
