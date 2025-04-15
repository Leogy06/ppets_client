"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import TransactionDetailsButton from "@/app/(component)/transaction_details_btn";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useApproveTransferTransactionMutation,
  useGetTransactionCountQuery,
  useGetTransactionsQuery,
  useRejectTransactionMutation,
} from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { mapTransactions } from "@/utils/arrayUtils";
import { handleError } from "@/utils/errorHandler";
import { Refresh } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

const TransactionRequests = () => {
  //use snackbar
  const { openSnackbar } = useSnackbar();
  const { empDetails } = useAuth();

  //get transaction count
  const { data: transactionCount } = useGetTransactionCountQuery({
    remarks: 4,
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
  });
  //row limit
  const [rowLimit, setRowLimit] = useState(10);
  //get transfer transaction
  const {
    data: transferTransactions,
    isLoading: isTransferTransactionsLoading,
    refetch: refetchTransferTransactions,
  } = useGetTransactionsQuery({
    LIMIT: rowLimit,
    TRANSACTION_TYPE: 4,
    DPT_ID: empDetails?.CURRENT_DPT_ID,
  });

  //map transfer transaction
  const mapTransferTransactions = useMemo(
    () => mapTransactions(transferTransactions),
    [transferTransactions]
  );

  //use reject transaction
  const [rejectTransaction, { isLoading: isRejectTransactionLoading }] =
    useRejectTransactionMutation();

  //columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "index",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "borrowedItem",
      headerName: "Borrowed Item",
      width: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      headerAlign: "center",
      align: "center",
      type: "number",
    },
    {
      field: "borrower",
      headerName: "Transfer to",
      width: 200,
    },
    {
      field: "owner",
      headerName: "Transfer from",
      width: 200,
    },
    {
      field: "transactionDescription",
      headerName: "Status",
      width: 200,
    },
    {
      field: "remarksDescription",
      headerName: "Remarks",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-1">
          <DefaultButton
            onClick={() => handleOpenRejectTransfer(params.row)}
            btnText="reject"
            variant="outlined"
            color="error"
            disabled={params.row.status !== 2}
          />
          <DefaultButton
            btnText="approve"
            onClick={() => handleOpenConfirmTransferModal(params.row)}
            disabled={params.row.status !== 2}
          />

          <TransactionDetailsButton transactionId={params.row.id} />
        </div>
      ),
    },
  ];

  //use approve transfer transction
  const [
    approveTransferTransaction,
    { isLoading: isApproveTransferTransactionLoading },
  ] = useApproveTransferTransactionMutation();

  //openmodal confirm apprve transaction
  const [isConfirmTransferOpen, setIsConfirmTransferOpen] = useState(false);
  //set item to approve
  const [transactionToApprove, settransactionToApprove] =
    useState<TransactionProps | null>(null);

  const [openRejectTransferModal, setOpenRejectTransferModal] = useState(false);

  //handle open Confirm Transfer Modal
  const handleOpenConfirmTransferModal = (transaction: TransactionProps) => {
    settransactionToApprove(transaction);
    setIsConfirmTransferOpen(true);
  };

  //handle onclick approve transfer
  const handleOnclickApproveTransfer = async () => {
    try {
      await approveTransferTransaction({
        transactionId: transactionToApprove?.id,
        APPROVED_BY: empDetails?.ID,
      }).unwrap();
      openSnackbar("Transfer Approved.", "success");
      setIsConfirmTransferOpen(false);
    } catch (error) {
      console.error(
        "Unable to approve transfer unexpected error occured.",
        error
      );
      const errMsg = handleError(
        error,
        "Unable to approve transfer unexpected error occured."
      );
      openSnackbar(errMsg, "error");
    }
  };

  //handle modal
  const OpenConfirmTransferModal = () => (
    <DefaultModal
      open={isConfirmTransferOpen}
      onClose={() => setIsConfirmTransferOpen(false)}
    >
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-lg">Approve this Transfer</h1>
        <p>Are you sure you want to approve this transfer?</p>
        <div className="flex flex-col">
          <h1>
            Item:{" "}
            <span className="font-bold underline underline-offset-2">
              {transactionToApprove?.borrowedItem}
            </span>
          </h1>
          <p>
            Transfer to:{" "}
            <span className="font-semibold underline underline-offset-1">
              {transactionToApprove?.borrower}
            </span>
          </p>
          <p>
            From:{" "}
            <span className="font-semibold underline underline-offset-1">
              {transactionToApprove?.owner}
            </span>
          </p>
          <p>
            From:{" "}
            <span className="font-semibold underline underline-offset-1">
              {transactionToApprove?.quantity}
            </span>
          </p>
        </div>
        <div className="flex gap-1 justify-end">
          <DefaultButton
            onClick={() => setIsConfirmTransferOpen(false)}
            btnText="cancel"
            variant="text"
            color="error"
            disabled={isApproveTransferTransactionLoading}
          />
          <DefaultButton
            btnText="approve"
            onClick={handleOnclickApproveTransfer}
            disabled={isApproveTransferTransactionLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );

  //handle reject
  const handleOpenRejectTransfer = (transaction: TransactionProps) => {
    setOpenRejectTransferModal(true);
    settransactionToApprove(transaction);
  };
  //handle onclick reject transfer
  const handleOnclickRejectTransfer = async () => {
    try {
      await rejectTransaction(transactionToApprove?.id).unwrap();
      openSnackbar("Transfer Rejected.", "success");
      setOpenRejectTransferModal(false);
    } catch (error) {
      console.error(
        "Unable to reject transfer unexpected error occured.",
        error
      );
      const errMsg = handleError(
        error,
        "Unable to reject transfer unexpected error occured."
      );
      openSnackbar(errMsg, "error");
    }
  };

  const OpenRejectTransferModal = () => (
    <DefaultModal
      open={openRejectTransferModal}
      onClose={() => setOpenRejectTransferModal(false)}
    >
      <h1>Reject Transfer Request</h1>
      <p>Are you sure you want to reject this transfer request</p>
      <div className="flex flex-col">
        <p>
          Item:{" "}
          <span className="font-bold underline underline-offset-2">
            {transactionToApprove?.borrowedItem}
          </span>
        </p>
        <p>
          Transfer to:{" "}
          <span className="font-semibold underline underline-offset-1">
            {transactionToApprove?.borrower}
          </span>
        </p>
        <p>
          From:{" "}
          <span className="font-semibold underline underline-offset-1">
            {transactionToApprove?.owner}
          </span>
        </p>
        <p>
          From:{" "}
          <span className="font-semibold underline underline-offset-1">
            {transactionToApprove?.quantity}
          </span>
        </p>
      </div>
      <div className="flex gap-1 justify-end">
        <DefaultButton
          btnText="cancel"
          onClick={() => setOpenRejectTransferModal(false)}
          variant="text"
          color="success"
          disabled={isRejectTransactionLoading}
        />
        <DefaultButton
          onClick={handleOnclickRejectTransfer}
          btnText="reject"
          color="error"
          disabled={isRejectTransactionLoading}
        />
      </div>
    </DefaultModal>
  );

  return (
    <>
      <div className="flex gap-1 items-center mb-4">
        <PageHeader pageHead="Transfer Requests" hasMarginBottom={false} />
        <OptionRowLimitCount
          currentValue={rowLimit}
          onChange={(limit) => setRowLimit(limit)}
          className="bg-white"
          totalCount={transactionCount}
        />
        <button onClick={refetchTransferTransactions}>
          <Refresh />
        </button>
      </div>
      <DataTable
        rows={mapTransferTransactions}
        loading={isTransferTransactionsLoading}
        columns={columns}
      />
      <OpenConfirmTransferModal />
      <OpenRejectTransferModal />
    </>
  );
};

export default TransactionRequests;
