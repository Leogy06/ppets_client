"use client";

import BackArrow from "@/app/(component)/backArrow";
import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetTransactionsQuery } from "@/features/api/apiSlice";
import { mapTransactions } from "@/utils/arrayUtils";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";

const BorrowTransactions = () => {
  const { empDetails } = useAuth();
  const [rowLimit, setRowLimit] = useState<number>(10);
  const {
    data: borrowingTransactions,
    isLoading: isBorrowingTransactionsLoading,
  } = useGetTransactionsQuery({
    EMP_ID: Number(empDetails?.ID),
    LIMIT: rowLimit,
    TRANSACTION_TYPE: 1,
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
  });
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    { field: "borrowedItem", headerName: "Item", width: 380 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    { field: "borrower", headerName: "Item Borrower", width: 280 },
    { field: "owner", headerName: "Item Owner", width: 280 },
    { field: "transaction", headerName: "Status", width: 200 },
    { field: "remarks", headerName: "Transaction", width: 200 },
  ];

  const arrMappedTransaction = useMemo(
    () => mapTransactions(borrowingTransactions || []),
    [borrowingTransactions]
  );

  useEffect(() => {
    if (borrowingTransactions) {
      console.log("borrowing transactions ", borrowingTransactions);
    }
  }, [borrowingTransactions]);

  return (
    <>
      <BackArrow backTo="/manager/request/borrow_items" />
      <PageHeader pageHead="Borrow Requests" />
      <DataTable
        columns={columns}
        rows={arrMappedTransaction || []}
        loading={isBorrowingTransactionsLoading}
        setRowLimit={setRowLimit}
        rowLimit={rowLimit}
      />
    </>
  );
};

export default BorrowTransactions;
