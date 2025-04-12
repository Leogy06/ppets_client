"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import RefreshButton from "@/app/(component)/refreshBtn";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useEditTransactionMutation,
  useGetTransactionCountQuery,
  useGetTransactionsQuery,
} from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { mapTransactions } from "@/utils/arrayUtils";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

const BorrowTransactions = () => {
  const { empDetails } = useAuth();
  const [rowLimit, setRowLimit] = useState<number>(10);
  //snackbar
  const { openSnackbar } = useSnackbar();
  //confirm return modal state

  const [openConfirmReturn, setOpenConfirmReturn] = useState(false);
  //return form
  const [returnForm, setReturnForm] = useState<Partial<TransactionProps>>({
    id: 0,
    remarks: 5,
  });

  // edit transaction into return and pending
  const [editTransaction] = useEditTransactionMutation();
  //get transaction count
  const { data: borrowTransactionCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    remarks: 1,
  });
  const {
    data: borrowingTransactions,
    isLoading: isBorrowingTransactionsLoading,
    refetch: refetchBorrowingTransactions,
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
    { field: "transactionDescription", headerName: "Status", width: 200 },
    { field: "remarksDescription", headerName: "Transaction", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-2 justify-center">
          <DefaultButton
            onClick={() => handleOpenConfirmReturn(params.row)}
            btnText="Return"
            disabled={
              params.row.status !== 1 || //disable if status is not aprrove
              params.row.remarks !== 1 || //disable if remakrs is not borrowing
              params.row.remarks !== 2 //disable if remakrs is not lending
            }
          />
        </div>
      ),
    },
  ];

  const arrMappedTransaction = useMemo(
    () => mapTransactions(borrowingTransactions || []),
    [borrowingTransactions]
  );

  //return confirm modal
  const ConfirmReturn = () => (
    <DefaultModal
      open={openConfirmReturn}
      onClose={() => setOpenConfirmReturn(false)}
    >
      <h1>Are you sure you want to return this item?</h1>
      <div className="flex justify-end">
        <DefaultButton
          btnText="No"
          variant="text"
          onClick={() => setOpenConfirmReturn(false)}
        />
        <DefaultButton btnText="Yes" onClick={handleEditTransactionReturn} />
      </div>
    </DefaultModal>
  );

  //open confirm return
  const handleOpenConfirmReturn = (data: TransactionProps) => {
    setOpenConfirmReturn(true);
    setReturnForm({
      id: data.id,
      remarks: 5, //return
      status: 2, //pending
    });
  };

  //handle edit transaction
  const handleEditTransactionReturn = async () => {
    try {
      const response = await editTransaction(returnForm).unwrap();
      console.log("response", response);
      openSnackbar("Item returned successfully", "success");
      setOpenConfirmReturn(false);
    } catch (error) {
      console.error(error);

      openSnackbar("Failed to return item", "error");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <BackArrow backTo="/manager/request/borrow_items" />
        <PageHeader pageHead="Borrow Requests" hasMarginBottom={false} />
        <OptionRowLimitCount
          onChange={(limit) => setRowLimit(limit)}
          totalCount={borrowTransactionCount}
          currentValue={rowLimit}
          className="bg-white"
        />
        <RefreshButton onClick={refetchBorrowingTransactions} />
      </div>
      <DataTable
        columns={columns}
        rows={arrMappedTransaction || []}
        loading={isBorrowingTransactionsLoading}
      />

      {/* confrim return */}
      <ConfirmReturn />
    </>
  );
};

export default BorrowTransactions;
