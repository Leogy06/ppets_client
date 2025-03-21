"use client";

import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetBorrowingTransactionByEmpIdQuery } from "@/features/api/apiSlice";
import { mapTransactions } from "@/utils/arrayUtils";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";

const BorrowTransactions = () => {
  const { empDetails } = useAuth();
  const [rowLimit, setRowLimit] = useState(10);
  const {
    data: borrowingTransactions,
    isLoading: isBorrowingTransactionsLoading,
  } = useGetBorrowingTransactionByEmpIdQuery({
    empId: Number(empDetails?.ID),
    limit: rowLimit,
  });
  const columns: GridColDef[] = [
    { field: "index", headerName: "#", width: 100 },
    { field: "borrowedItem", headerName: "Item", width: 200 },
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
      <PageHeader pageHead="Borrow Requests" />
      <DataTable
        columns={columns}
        rows={arrMappedTransaction || []}
        loading={isBorrowingTransactionsLoading}
      />
    </>
  );
};

export default BorrowTransactions;
