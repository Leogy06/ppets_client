"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetBorrowingTransactionByDptQuery } from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";

const page = () => {
  const { empDetails } = useAuth();
  const { data: borrowingTransactions, isLoading } =
    useGetBorrowingTransactionByDptQuery(empDetails?.CURRENT_DPT_ID);
  useEffect(() => {
    if (borrowingTransactions) {
      console.log("borrowing transactions ", borrowingTransactions);
    }
  }, [borrowingTransactions]);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <>
      <PageHeader pageHead="Requests" />
    </>
  );
};

export default page;
