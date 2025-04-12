"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import RefreshButton from "@/app/(component)/refreshBtn";
import TransactionDetailsButton from "@/app/(component)/transaction_details_btn";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useApproveReturnTransactionMutation,
  useGetTransactionCountQuery,
  useGetTransactionsQuery,
  useRejectTransactionMutation,
} from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { mapTransactions } from "@/utils/arrayUtils";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

const LendRequests = () => {
  //modal approve
  const [openApproveModal, setOpenApproveModal] = useState(false);
  //modal reject
  const [openRejectModal, setOpenRejectModal] = useState(false);
  // trasnaction form
  const [transactionForm, setTransactionForm] = useState(
    {} as Partial<TransactionProps>
  );
  //ue snackbar
  const { openSnackbar } = useSnackbar();
  //use emp details
  const { empDetails } = useAuth();
  //row limit
  const [rowLimit, setRowLimit] = useState(10);
  const {
    data: returnRequestsTransactions,
    isLoading: isReturnRequestsTransactionsLoading,
    refetch: refetchTransactionReturn,
  } = useGetTransactionsQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    TRANSACTION_TYPE: 5, //
    LIMIT: rowLimit,
  });
  //mapped transaction
  const mappedReturnTransaction = useMemo(
    () => mapTransactions(returnRequestsTransactions),
    [returnRequestsTransactions]
  );
  //get trnsaction count
  const { data: returnRequestsCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    remarks: 5, //return
  });
  //use reject
  const [rejectTransaction, { isLoading: isRejectTransactionLoading }] =
    useRejectTransactionMutation();
  //handle reject transaction
  const handleRejectTransaction = async () => {
    try {
      const result = await rejectTransaction(transactionForm.id).unwrap();
      openSnackbar(result?.message ?? "Transaction rejected. ", "success");
      setOpenRejectModal(false);
    } catch (error) {
      console.error("Unable to reject transaction. ", error);
      const errMsg = handleError(error, "Unable to reject transaction.");
      openSnackbar(errMsg, "error");
      setOpenRejectModal(false);
    }
  };
  //handle open reject modal
  const handleOpenRejectModal = (transaction: TransactionProps) => {
    setTransactionForm(transaction);
    setOpenRejectModal(true);
  };

  //use approve return
  const [approveReturn, { isLoading: isApproveReturnLoading }] =
    useApproveReturnTransactionMutation();
  const handleOpenApproveModal = (transaction: TransactionProps) => {
    setTransactionForm(transaction);
    setOpenApproveModal(true);
  };
  //handle approve transaction
  const handleApproveTransaction = async () => {
    try {
      const result = await approveReturn({
        transactionId: Number(transactionForm.id),
        APPROVED_BY: Number(empDetails?.ID),
      }).unwrap();
      openSnackbar(result?.message ?? "Transaction approved. ", "success");
      setOpenApproveModal(false);
    } catch (error) {
      console.error("Unable to approve transaction. ", error);
      const errMsg = handleError(error, "Unable to approve transaction.");
      openSnackbar(errMsg, "error");
      setOpenApproveModal(false);
    }
  };

  //column
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "index", headerName: "#", width: 50 },
    { field: "borrowedItem", headerName: "Return Item", width: 200 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    { field: "borrower", headerName: "Returner", width: 280 },
    { field: "owner", headerName: "Owner", width: 280 },
    { field: "transactionDescription", headerName: "Description", width: 280 },
    { field: "remarksDescription", headerName: "Remarks", width: 280 },
    {
      field: "createdAt",
      headerName: "Requested on",
      width: 200,
      type: "dateTime",
      valueGetter: (params) => new Date(params),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-1">
          <DefaultButton
            disabled={params.row.status !== 2 || params.row.remarks !== 5}
            variant="outlined"
            color="error"
            btnText="reject"
            onClick={() => handleOpenRejectModal(params.row)}
          />
          <DefaultButton
            disabled={params.row.status !== 2 || params.row.remarks !== 5}
            btnText="approve"
            onClick={() => handleOpenApproveModal(params.row)}
          />

          <TransactionDetailsButton transactionId={params.row.id} />
        </div>
      ),
    },
  ];
  //modal reject
  const RejectModal = () => (
    <DefaultModal
      open={openRejectModal}
      onClose={() => setOpenRejectModal(false)}
    >
      <h1>Reject Return</h1>
      <p>Are you sure you want to reject this return?</p>
      <div className="flex flex-col my-2">
        <p>Item: {transactionForm?.borrowedItem}</p>
        <p>Quantity: {transactionForm?.quantity}</p>
        <p>Returner: {transactionForm?.borrower}</p>
        <p>Owner: {transactionForm?.owner}</p>
        <div className="flex justify-end gap-1">
          <DefaultButton
            btnText="cancel"
            variant="text"
            onClick={() => setOpenRejectModal(false)}
            color="error"
          />
          <DefaultButton
            btnText="approve"
            onClick={handleRejectTransaction}
            disabled={isRejectTransactionLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );
  //modal approve
  const ApproveModal = () => (
    <DefaultModal
      open={openApproveModal}
      onClose={() => setOpenApproveModal(false)}
    >
      <h1>Approve Return</h1>
      <p>Are you sure you want to approve this return?</p>
      <div className="flex flex-col my-2">
        <p>Item: {transactionForm?.borrowedItem}</p>
        <p>Quantity: {transactionForm?.quantity}</p>
        <p>Returner: {transactionForm?.borrower}</p>
        <p>Owner: {transactionForm?.owner}</p>
        <div className="flex justify-end gap-1">
          <DefaultButton
            btnText="cancel"
            variant="text"
            onClick={() => setOpenApproveModal(false)}
            color="error"
          />
          <DefaultButton
            btnText="approve"
            onClick={handleApproveTransaction}
            disabled={isApproveReturnLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <PageHeader pageHead="Return Requests" hasMarginBottom={false} />
        <OptionRowLimitCount
          onChange={(limit) => setRowLimit(limit)}
          totalCount={returnRequestsCount}
          currentValue={rowLimit}
          className="bg-white"
        />
        <RefreshButton onClick={refetchTransactionReturn} />
      </div>
      <DataTable
        rows={mappedReturnTransaction}
        columns={columns}
        loading={isReturnRequestsTransactionsLoading}
      />
      <RejectModal />
      <ApproveModal />
    </>
  );
};

export default LendRequests;
