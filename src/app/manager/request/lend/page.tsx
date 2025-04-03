"use client";

import DataTable from "@/app/(component)/datagrid";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetTransactionCountQuery,
  useGetTransactionsQuery,
} from "@/features/api/apiSlice";
import { mapTransactions } from "@/utils/arrayUtils";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

//show lend request
const LendRequests = () => {
  const { empDetails } = useAuth();
  //get lend transactions count
  const { data: lendTransactionCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    remarks: 2, //lend
  });
  //row limit
  const [rowLimit, setRowLimit] = useState(10);
  //get lend transactions
  const { data: lendTransactions, isLoading: isLendTransactionsLoading } =
    useGetTransactionsQuery({
      DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
      TRANSACTION_TYPE: 2, //lend
      LIMIT: rowLimit,
      EMP_ID: Number(empDetails?.ID),
    });

  //mapped transaction
  const mappedLendTransaction = useMemo(
    () => mapTransactions(lendTransactions),
    [lendTransactions]
  );
  //lend transaction column
  const columns: GridColDef[] = [
    { field: "index", headerName: "#", width: 50 },
    { field: "borrowedItem", headerName: "Item", width: 200 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    { field: "borrower", headerName: "Borrower", width: 250 },
    { field: "owner", headerName: "Owner", width: 250 },
    { field: "transactionDescription", headerName: "Status", width: 200 },
    { field: "remarksDescription", headerName: "Transaction", width: 200 },
  ];
  return (
    <>
      <div className="mb-4 flex gap-2">
        <PageHeader pageHead="Lend Requests" hasMarginBottom={false} />
        <OptionRowLimitCount
          currentValue={rowLimit}
          onChange={(limit) => setRowLimit(limit)}
          className="bg-white"
          totalCount={lendTransactionCount}
        />
      </div>

      <DataTable
        rows={mappedLendTransaction || []}
        columns={columns}
        loading={isLendTransactionsLoading}
      />
    </>
  );
};

export default LendRequests;
