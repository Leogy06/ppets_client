import EmployeeHeader from "@/app/(components)/employee-header";
import React from "react";

const EmployeeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" space-y-4">
      <EmployeeHeader />
      <main className="container mx-auto py-10 min-h-screen px-4 md:px-0">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
