"use client";

import { ArrowRight, PeopleOutlineOutlined } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const EmployeeLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  //router
  const router = useRouter();
  return (
    <>
      <div className="flex items-baseline gap-2 w-full overflow-auto">
        <h1 className="text-2xl font-semibold mb-4 ">
          <PeopleOutlineOutlined />
          <span
            className="hover:underline-offset-1 hover:cursor-pointer"
            onClick={() => pathname !== "/employee" && router.push("/employee")}
          >
            Employee
          </span>
        </h1>
        {/**add further pathname */}
        {pathname === "/employee/add_employee" && (
          <h1 className={`text-xl font-medium mb-4 flex gap-1`}>
            <ArrowRight />{" "}
            <a
              href="/employee/add_employee "
              className={`${
                pathname === "/employee/add_employee" &&
                "font-semibold text-blue-600"
              }`}
            >
              Add Employee
            </a>
          </h1>
        )}
      </div>
      {children}
    </>
  );
};

export default EmployeeLayout;
