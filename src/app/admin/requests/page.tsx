"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useEditBorrowingTransactionMutation,
  useGetBorrowingTransactionByDptQuery,
} from "@/features/api/apiSlice";
import { BorrowingStatusProps, Employee } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { Modal, Paper, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

const ConfirmModalApprove = ({
  open,
  close,
  handleEditBorrowTransaction,
  status,
}: {
  open: boolean;
  close: () => void;
  handleEditBorrowTransaction: () => void;
  status: number;
}) => {
  return (
    <Modal open={open} onClose={close}>
      <div className="flex flex-col h-full items-center justify-center">
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            padding: "1rem",
          }}
        >
          <h1 className="text-lg font-semibold text-center">
            {status === 1
              ? "Confirm Approved"
              : status === 3
              ? "Reject Request"
              : "Unknow Request"}
          </h1>
          <div className="flex gap-1 items-baseline justify-center">
            <DefaultButton btnText="cancel" variant="text" onClick={close} />
            <DefaultButton
              btnText="confirm"
              onClick={handleEditBorrowTransaction}
            />
          </div>
        </Paper>
      </div>
    </Modal>
  );
};

const Requests = () => {
  //use hooks
  const { empDetails } = useAuth();
  const { data: borrowingTransactions, isLoading } =
    useGetBorrowingTransactionByDptQuery(empDetails?.CURRENT_DPT_ID);
  //use edit borrow transaciton
  const [editBorrowingTransaction] = useEditBorrowingTransactionMutation();

  //snackbar
  const { openSnackbar } = useSnackbar();

  //states
  //edit form
  const [editItemForm, setEditItemForm] = useState({
    status: 0,
    itemId: 0,
  });
  //modal
  const [openModal, setOpenModal] = useState(false);

  //handles
  //items
  const handleOpenModalConfirmation = (itemId: number, status: number) => {
    setOpenModal(true);
    setEditItemForm({
      itemId,
      status,
    });
  };

  //close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItemForm({ status: 0, itemId: 0 });
  };

  //handle edit
  const handleEditBorrowTransaction = async () => {
    if (editItemForm.status === 0 || editItemForm.itemId === 0) {
      openSnackbar("Status or Itemid should not be zero or null. ", "error");
      return;
    }
    try {
      await editBorrowingTransaction({
        borrowId: editItemForm.itemId,
        updateEntry: editItemForm.status,
      }).unwrap();

      handleCloseModal();
    } catch (error) {
      console.error("Unable to edit borrow transaction. ", error);
      handleError(error, "Unable to edit borrow transaction. ");
    }
  };

  //colums
  const columns: GridColDef[] = [
    {
      field: "borrowedItemDetails",
      headerName: "Item name",

      width: 120,
      renderCell: (params) => {
        return (
          <Tooltip
            title={params.row.borrowedItemDetails.description}
            placement="top-start"
          >
            <span>{params.row.borrowedItemDetails.name}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 90,
    },
    {
      field: "statusDetails",
      headerName: "Status",
      valueGetter: (params: BorrowingStatusProps) =>
        params?.description.toUpperCase() ?? "Unknown or Invalid",
      cellClassName: (params) =>
        params.row.status === 1
          ? "cell-approved"
          : params.row.status === 2
          ? "cell-pending"
          : params.row.status === 3
          ? "cell-rejected"
          : params.row.status === 4
          ? "cell-cancel"
          : "cell-unknown",
    },

    {
      field: "ownerEmp",
      headerName: "Item Owner",
      valueGetter: (params: Employee) => {
        return params
          ? `${params.LASTNAME} ${params.FIRSTNAME} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "Failed to Retrieved name";
      },
      width: 180,
    },
    {
      field: "borrowerEmp",
      headerName: "Borrower",
      valueGetter: (params: Employee) => {
        return params
          ? `${params.LASTNAME} ${params.FIRSTNAME} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "Failed to Retrieved name";
      },
      width: 180,
    },

    {
      field: "createdAt",
      headerName: "Requested on",
      width: 180,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : "--"),
    },
    {
      field: "remarks",
      headerName: "Reason for Borrowing",
      width: 200,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex gap-1">
            <DefaultButton
              color="error"
              btnText="reject"
              variant="text"
              onClick={() => handleOpenModalConfirmation(params.row.id, 3)}
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4 ||
                params.row.status === 5
              }
            />
            <DefaultButton
              btnText="approve"
              onClick={() => handleOpenModalConfirmation(params.row.id, 1)}
              color="success"
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4 ||
                params.row.status === 5
              }
            />
          </div>
        );
      },
    },
  ];

  //console log the borrow transactions
  // useEffect(() => {
  //   if (borrowingTransactions) {
  //     console.log("borrowing transactions ", borrowingTransactions);
  //   }
  // }, [borrowingTransactions]);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <>
      <PageHeader pageHead="Requests" />
      <DataGrid
        columns={columns}
        rows={borrowingTransactions}
        disableRowSelectionOnClick
        sx={{
          height: 400,
          "& .cell-approved": { backgroundColor: "#90ee90 ", color: "#333" }, // Light green
          "& .cell-rejected": { backgroundColor: "#ffccbc", color: "#333" }, // Light red
          "& .cell-pending": { backgroundColor: "#adff2f", color: "#333" }, // green yellow
          "& .cell-cancel": { backgroundColor: "#d8bfd8", color: "#333" }, // thirstle: purple
        }}
      />
      <ConfirmModalApprove
        open={openModal}
        close={handleCloseModal}
        handleEditBorrowTransaction={handleEditBorrowTransaction}
        status={editItemForm.status}
      />
    </>
  );
};

export default Requests;
