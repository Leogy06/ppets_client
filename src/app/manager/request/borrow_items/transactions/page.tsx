"use client";

import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetBorrowingTransactionByEmpIdQuery } from "@/features/api/apiSlice";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

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
  const columns: GridColDef[] = [{ field: "id", headerName: "ID", width: 100 }];
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
        rows={borrowingTransactions || []}
        loading={isBorrowingTransactionsLoading}
      />
    </>
  );
};

export default BorrowTransactions;
