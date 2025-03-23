"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useEditTransactionMutation,
  useGetTransactionsQuery,
} from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { mapTransactions } from "@/utils/arrayUtils";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

const TransferTransaction = () => {
  //use snackbar
  const { openSnackbar } = useSnackbar();
  const { empDetails } = useAuth();
  //row limt
  const [rowLimit, setRowLimit] = useState(10);

  //approve transaction
  const [transactionForm, setTransactionForm] = useState<
    Partial<TransactionProps>
  >({
    id: 0,
    status: 0,
    remarks: 0,
    DISTRIBUTED_ITM_ID: 0,
    quantity: 0,
    borrower_emp_id: 0,
    owner_emp_id: 0,
    APPROVED_BY: 0,
    owner: "",
    borrower: "",
    borrowedItem: "",
    DPT_ID: 0,
    distributed_item_id: 0,
  });
  //modal transction
  const [openModalApprove, setOpenModalApprove] = useState(false);

  const {
    data: transferTransactions,
    isLoading: isTransferTransactionsLoading,
  } = useGetTransactionsQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    TRANSACTION_TYPE: 4, //lend
    LIMIT: rowLimit,
  });

  //edit transaction
  const [editTransaction, { isLoading: isEditLoading }] =
    useEditTransactionMutation();

  //modal reject
  const [openModalReject, setOpenModalReject] = useState(false);

  //close transaction form modal
  const handleOpenRejectModal = (transaction: TransactionProps) => {
    setOpenModalReject(true);
    setTransactionForm({
      ...transaction,
      status: 4, //reject
    });
  };

  //open Transaction form modal
  const openTransactionFormModal = (transaction: TransactionProps) => {
    setOpenModalApprove(true);
    setTransactionForm({
      ...transaction,
      APPROVED_BY: empDetails?.ID, //approving by user
      status: 1, //approved
    });
  };

  //approve transaction
  const approveTransactionSubmit = async () => {
    try {
      const result = await editTransaction(transactionForm).unwrap();
      openSnackbar(result?.message ?? "Transaction approved. ", "success");
      closeTransactionFormModal();
    } catch (error) {
      console.error("Unable to approve transaction. ", error);
      const errMgs = handleError(error, "Unable to approve transaction.");
      openSnackbar(errMgs, "error");
    }
  };

  //reject transaction
  const rejectTransactionSubmit = async () => {
    try {
      const result = await editTransaction(transactionForm).unwrap();
      openSnackbar(result?.message ?? "Transaction rejected. ", "success");
      closeTransactionFormModal();
    } catch (error) {
      console.error("Unable to reject transaction. ", error);
      const errMgs = handleError(error, "Unable to reject transaction.");
      openSnackbar(errMgs, "error");
    }
  };

  //close Transaction form modal
  const closeTransactionFormModal = () => {
    setOpenModalApprove(false);
    setTransactionForm({
      id: 0,
      status: 0,
      remarks: 0,
      DISTRIBUTED_ITM_ID: 0,
      quantity: 0,
      borrower_emp_id: 0,
      owner_emp_id: 0,
      APPROVED_BY: 0,
      borrower: "",
      owner: "",
    });
  };

  const memoizedTransaction = useMemo(
    () => mapTransactions(transferTransactions || []),
    [transferTransactions]
  );

  const columns: GridColDef[] = [
    { field: "index", headerName: "#", width: 100 },
    { field: "borrowedItem", headerName: "Item", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "borrower", headerName: "Item Borrower", width: 200 },
    { field: "owner", headerName: "Item Owner", width: 200 },
    { field: "transactionDescription", headerName: "Status", width: 200 },
    { field: "remarksDescription", headerName: "Transaction", width: 200 },
    {
      field: "createdAt",
      headerName: "Requested Date",
      width: 200,
      type: "dateTime",
      valueGetter: (params) => {
        return params ? new Date(params) : "0000-00-00";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center gap-1">
          <DefaultButton
            onClick={() => handleOpenRejectModal(params.row)}
            btnText="reject"
            variant="outlined"
            color="error"
            disabled={params.row.status !== 2}
          />
          <DefaultButton
            disabled={params.row.status !== 2}
            onClick={() => {
              // console.log("params.row ", params.row);
              openTransactionFormModal(params.row);
            }}
            btnText="approve"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <PageHeader pageHead="Borrow Requests" hasMarginBottom={false} />
        <OptionRowLimitCount
          className="bg-white"
          onChange={setRowLimit}
          currentValue={rowLimit}
        />
      </div>
      <DataTable
        rows={memoizedTransaction || []}
        columns={columns}
        loading={isTransferTransactionsLoading}
      />
      <ApproveModal
        open={openModalApprove}
        onClose={() => setOpenModalApprove(false)}
        transactionForm={transactionForm}
        handleApprove={approveTransactionSubmit}
        loading={isEditLoading}
      />

      <RejectModal
        onClose={() => setOpenModalReject(false)}
        open={openModalReject}
        transactionForm={transactionForm}
        handleReject={rejectTransactionSubmit}
        loading={isEditLoading}
      />
    </>
  );
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  transactionForm: Partial<TransactionProps>;
  handleApprove?: () => void;
  loading: boolean;
  handleReject?: () => void;
  setTransactionForm: (transactionForm: Partial<TransactionProps>) => void;
}

const ApproveModal = ({
  open,
  onClose,
  transactionForm,
  handleApprove,
  loading,
  setTransactionForm,
}: ModalProps) => {
  // console.log("transactionForm ", transactionForm);

  return (
    <DefaultModal open={open} onClose={onClose}>
      <h1 className="text-lg font-bold">Approve Transaction</h1>
      <p className="mb-4">Are you sure you want to approve this transaction?</p>
      <div className="flex flex-col mb-4">
        <p>Item: {transactionForm?.borrowedItem}</p>
        <p>Quantity: {transactionForm?.quantity}</p>
        <p>From: {transactionForm?.owner}</p>
        <p>Transfer to: {transactionForm?.borrower}</p>
      </div>

      <div className="flex flex-col">
        <DefaultTextField
          name="quantity"
          label="Quantity"
          type="number"
          value={
            transactionForm?.quantity ? String(transactionForm?.quantity) : ""
          }
          onChange={(e) => setTransactionForm((prevForm) => ({
            ...prevForm,
            quantity: Number(e.target.value),
          }))}
        />
      </div>

      <div className="flex gap-1 justify-end">
        <DefaultButton
          btnText="cancel"
          variant="text"
          onClick={onClose}
          color="error"
          disabled={loading}
        />
        <DefaultButton
          btnText="approve"
          onClick={handleApprove}
          disabled={loading}
        />
      </div>
    </DefaultModal>
  );
};

//reject modal
const RejectModal = ({
  open,
  onClose,
  transactionForm,
  handleReject,
  loading,
}: ModalProps) => {
  // console.log("transactionForm ", transactionForm);

  return (
    <DefaultModal open={open} onClose={onClose}>
      <h1 className="text-lg font-bold">Reject Transaction</h1>
      <p className="mb-4">Are you sure you want to reject this transaction?</p>
      <div className="flex flex-col mb-4">
        <p>Item: {transactionForm?.borrowedItem}</p>
        <p>Quantity: {transactionForm?.quantity}</p>
        <p>Borrower: {transactionForm?.borrower}</p>
        <p>Owner: {transactionForm?.owner}</p>
      </div>

     

      <div className="flex gap-1 justify-end">
        <DefaultButton
          btnText="cancel"
          variant="text"
          onClick={onClose}
          color="error"
          disabled={loading}
        />
        <DefaultButton
          btnText="approve"
          onClick={handleReject}
          disabled={loading}
        />
      </div>
    </DefaultModal>
  );
};

export default TransferTransaction;
