"use client";

import { PeopleOutlineOutlined } from "@mui/icons-material";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        <PeopleOutlineOutlined />
        Employee
      </h1>
      {children}
    </>
  );
};

export default layout;
