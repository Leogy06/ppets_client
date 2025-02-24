"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useEditBorrowingTransactionMutation,
  useGetBorrowingTransactionByOwnerQuery,
  useGetStatusProcessQuery,
} from "@/features/api/apiSlice";
import { Employee } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { Modal, Paper, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

const ConfirmApproved = ({
  open,
  close,
  handleEditBorrowTransaction,
}: {
  open: boolean;
  close: () => void;
  handleEditBorrowTransaction: () => void;
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
            Confirm Approved?
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

const ConfirmReject = ({
  open,
  close,
  handleEditBorrowTransaction,
}: {
  open: boolean;
  close: () => void;
  handleEditBorrowTransaction: () => void;
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
            Reject item request?
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

const BorrowingHistory = () => {
  const { empDetails } = useAuth();
  const { openSnackbar } = useSnackbar();

  //get status process
  const { data: statusProcesses } = useGetStatusProcessQuery();
  //get borrowing history
  const { data: borrowingLogs, isLoading: isBorrowingLogsLdng } =
    useGetBorrowingTransactionByOwnerQuery(empDetails?.ID);

  //update status
  const [editBorrowingTransaction] = useEditBorrowingTransactionMutation();

  //use states
  //confrm approved state
  const [confirmApprovedOpen, setConfirmApprovedOpen] = useState(false);

  //confirm reject state
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);

  const [itemForm, setItemForm] = useState({
    itemId: 0,
    status: 0,
  });

  //handles
  const handleCloseModal = () => {
    setItemForm({ itemId: 0, status: 0 });
    if (confirmApprovedOpen === true) {
      setConfirmApprovedOpen(false);
    }
    if (confirmRejectOpen === true) {
      setConfirmRejectOpen(false);
    }
  };
  //handle edit borrow transaction status
  const handleEditBorrowTransaction = async () => {
    if (itemForm.status === 0) {
      openSnackbar("Status should not be zero or null.", "error");
      return;
    }

    try {
      await editBorrowingTransaction({
        borrowId: itemForm.itemId,
        updateEntry: itemForm.status,
      }).unwrap();
      handleCloseModal();

      // console.log("result ", result);
    } catch (error) {
      console.error("Unable to edit the transaction.", error);
      handleError(error, "Unable to edit the transaction.");
    }
  };

  //handle edit item status
  //for approved and reject
  const handleItemId = (itemId: number, status: number) => {
    if (status === 1) {
      setConfirmApprovedOpen(true);
    }

    if (status === 3) {
      setConfirmRejectOpen(true);
    }
    setItemForm({ itemId, status });
  };

  const columns: GridColDef[] = [
    {
      field: "borrowedItemDetails",
      headerName: "Borrowed Item",
      width: 180,
      renderCell: (params) => {
        const { name, description } = params.row.borrowedItemDetails;

        return <Tooltip title={<>{description}</>}>{name}</Tooltip>;
      },
    },
    {
      field: "borrowerEmp",
      headerName: "Requestor",
      width: 180,
      valueGetter: (params: Employee) => {
        return `${params.LASTNAME} ${params.FIRSTNAME} ${
          params?.MIDDLENAME ?? ""
        } ${params?.SUFFIX ?? ""}`;
      },
    },
    {
      field: "ownerEmp",
      headerName: "Item Owner",
      width: 180,
      valueGetter: (params: Employee) => {
        return `${params.LASTNAME} ${params.FIRSTNAME} ${
          params?.MIDDLENAME ?? ""
        } ${params?.SUFFIX ?? ""}`;
      },
    },
    { field: "quantity", headerName: "Quantity", width: 70 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      valueGetter: (params) => {
        return statusProcesses
          ?.find((status) => status.id === params)
          ?.description.toUpperCase();
      },
    },
    { field: "remarks", headerName: "Reason for Borrowing", width: 200 },
    {
      field: "createdAt",
      headerName: "Requested at",
      width: 180,
      type: "dateTime",
      valueGetter: (params) => {
        return params ? new Date(params) : "--";
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center p-1">
            <DefaultButton
              btnText="approve"
              onClick={() => handleItemId(params.row.id, 1)}
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4 ||
                params.row.status === 5
              }
            />
            <DefaultButton
              btnText="reject"
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4 ||
                params.row.status === 5
              }
              color="secondary"
              onClick={() => handleItemId(params.row.id, 3)}
            />
          </div>
        );
      },
    },
  ];

  // console logging effect
  // useEffect(() => {
  //   if (borrowingLogs) {
  //     console.log("Borrowing logs ", borrowingLogs);
  //   }
  // }, [borrowingLogs]);

  return (
    <>
      <PageHeader pageHead="Item Requests" />
      <DataGrid
        sx={{ height: 480 }}
        rows={borrowingLogs}
        getRowId={(params) => params.id}
        columns={columns}
        loading={isBorrowingLogsLdng}
      />
      <ConfirmApproved
        open={confirmApprovedOpen}
        close={handleCloseModal}
        handleEditBorrowTransaction={handleEditBorrowTransaction}
      />
      <ConfirmReject
        open={confirmRejectOpen}
        close={handleCloseModal}
        handleEditBorrowTransaction={handleEditBorrowTransaction}
      />
    </>
  );
};

export default BorrowingHistory;
