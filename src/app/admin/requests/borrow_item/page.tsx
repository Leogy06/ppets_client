"use client";

import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetTransactionsQuery } from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo } from "react";

const BorrowTransaction = () => {
  const { empDetails } = useAuth();

  const {
    data: borrowingTransactions,
    isLoading: isBorrowingTransactionsLoading,
  } = useGetTransactionsQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    TRANSACTION_TYPE: 1,
  });

  console.log("type of borrowing transaction ", typeof borrowingTransactions);

  console.log("borrowing transactions ", borrowingTransactions);

  const memoizedTransaction = useMemo(
    () =>
      borrowingTransactions?.map((transaction) => ({
        ...transaction,
        newId: transaction.id,
      })),
    [borrowingTransactions]
  );

  const columns: GridColDef[] = [
    { field: "newId", headerName: "ID", width: 100 },
  ];

  return (
    <>
      <PageHeader pageHead="Borrow Requests" />
      <DataTable
        rows={memoizedTransaction || []}
        columns={columns}
        loading={isBorrowingTransactionsLoading}
      />
    </>
  );
};

export default BorrowTransaction;
