"use client";

import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetTransactionsQuery } from "@/features/api/apiSlice";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";

const BorrowTransaction = () => {
  const { empDetails } = useAuth();

  const {
    data: borrowingTransactions,
    isLoading: isBorrowingTransactionsLoading,
  } = useGetTransactionsQuery({
    DPT_ID: empDetails?.CURRENT_DPT_ID,
    TRANSACTION_TYPE: 1,
  });

  const columns: GridColDef[] = [{ field: "id", headerName: "ID", width: 100 }];

  useEffect(() => {
    if (borrowingTransactions) {
      console.log("borrowingTransactions", borrowingTransactions);
    }
  }, [borrowingTransactions]);

  return (
    <>
      <PageHeader pageHead="Borrow Requests" />
      <DataTable
        rows={borrowingTransactions}
        columns={columns}
        loading={isBorrowingTransactionsLoading}
      />
    </>
  );
};

export default BorrowTransaction;
