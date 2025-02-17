"use client";

import { useParams } from "next/navigation";
import React from "react";

const LentItems = () => {
  const { empId } = useParams();

  if (!empId) {
    return <div className="text-red-500">Employee ID is missing</div>;
  }

  return <div>LentItems: {empId}</div>;
};

export default LentItems;
