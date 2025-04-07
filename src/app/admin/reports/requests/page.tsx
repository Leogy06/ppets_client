"use client";

import BackArrow from "@/app/(component)/backArrow";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { Paper } from "@mui/material";
import React, { useState } from "react";

const RequestReports = () => {
  const { empDetails } = useAuth();
  //request limit to display

  return (
    <>
      <div className="flex gap-1 items-center">
        <BackArrow />
        <PageHeader pageHead="Build Report" hasMarginBottom={false} />
      </div>
    </>
  );
};

export default RequestReports;
