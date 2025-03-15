"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useApproveTransactionMutation,
  useGetBorrowingTransactionByDptQuery,
  useRejectTransactionMutation,
} from "@/features/api/apiSlice";
import {
  BorrowingStatusProps,
  BorrowingTransactionTypes,
  Employee,
  TransactionRemarksProp,
  UndistributedItem,
} from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { Cancel, PictureAsPdf } from "@mui/icons-material";
import { Modal, Paper, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

//confirm approve modal
const ConfirmModalApprove = ({
  open,
  close,
  handleApproveTransaction,
  isLoading,
}: {
  open: boolean;
  close: () => void;
  handleApproveTransaction: () => void;
  isLoading: boolean;
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
          <h1 className="text-lg font-semibold text-center">Approve Lend?</h1>
          <div className="flex gap-1 items-baseline justify-center">
            <DefaultButton
              btnText="cancel"
              variant="text"
              onClick={close}
              disabled={isLoading}
            />
            <DefaultButton
              btnText="confirm"
              onClick={handleApproveTransaction}
              disabled={isLoading}
            />
          </div>
        </Paper>
      </div>
    </Modal>
  );
};

//confirm reject modal
const ConfirmModalReject = ({
  open,
  close,
  handleRejectTransaction,
  isLoading,
}: {
  open: boolean;
  close: () => void;
  handleRejectTransaction: () => void;
  isLoading: boolean;
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
          <h1 className="text-lg font-semibold text-center flex items-center gap-1 justify-center">
            <Cancel color="error" /> Reject Lend?
          </h1>
          <div className="flex gap-1 items-baseline justify-center">
            <DefaultButton
              btnText="cancel"
              variant="text"
              onClick={close}
              disabled={isLoading}
            />
            <DefaultButton
              btnText="confirm"
              onClick={handleRejectTransaction}
              disabled={isLoading}
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

  //snackbar
  const { openSnackbar } = useSnackbar();

  //use approve transaction
  const [approveTransaction, { isLoading: isApproveLoading }] =
    useApproveTransactionMutation();

  //use reject transaction
  const [rejectTransaction, { isLoading: isRejectloading }] =
    useRejectTransactionMutation();

  //states
  //open modal approve
  const [openModalApprove, setOpenModalApprove] = useState(false);

  //open modal reject
  const [openModalReject, setOpenModalReject] = useState(false);

  //transaction id state
  const [transactionId, setTransactionId] =
    useState<BorrowingTransactionTypes["id"]>(null);

  //handles
  //handle open modal
  const handleOpenModalConfirmationApprove = (
    transactionId: BorrowingTransactionTypes["id"]
  ) => {
    setTransactionId(transactionId);
    setOpenModalApprove(true);
  };

  //close modal approve
  const handleCloseModalApprove = () => {
    setTransactionId(null);
    setOpenModalApprove(false);
  };

  //handle open modal reject
  const handleOpenModalConfirmationReject = (
    transactionId: BorrowingTransactionTypes["id"]
  ) => {
    setTransactionId(transactionId);
    setOpenModalReject(true);
  };

  //close modal reject
  const handleCloseModalReject = () => {
    setTransactionId(null);
    setOpenModalReject(false);
  };

  //handle approve transaction
  const handleApproveTransaction = async () => {
    try {
      const result = await approveTransaction({
        transactionId,
        approverId: empDetails?.ID,
      }).unwrap();

      openSnackbar(result.message ?? "Transaction approved. ", "success");
      handleCloseModalApprove();
    } catch (error) {
      console.error("Unable to approve transaction.", error);

      const errMsg = handleError(error, "Unable to approve transaction.");
      openSnackbar(errMsg, "error");
    }
  };

  //handle reject transaction
  const handleRejectTransaction = async () => {
    try {
      const result = await rejectTransaction(transactionId).unwrap();

      openSnackbar(result.message ?? "Transaction rejected. ", "success");
      handleCloseModalReject();
    } catch (error) {
      console.error("Unable to Reject transaction.", error);

      const errMsg = handleError(error, "Unable to reject transaction.");
      openSnackbar(errMsg, "error");
    }
  };

  //colums
  const columns: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Item name",
      width: 180,
      valueGetter: (params: UndistributedItem) => {
        return params ? `${params.ITEM_NAME}` : "--";
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 80,
    },

    {
      field: "statusDetails",
      headerName: "Status",
      valueGetter: (params: BorrowingStatusProps) =>
        params?.description.toUpperCase() ?? "--",
      cellClassName: (params) =>
        params.row.status === 1
          ? "cell-approved"
          : params.row.status === 2
          ? "cell-pending"
          : params.row.status === 3
          ? "cell-cancel"
          : params.row.status === 4
          ? "cell-rejected"
          : "cell-unknown",
    },

    {
      field: "ownerEmp",
      headerName: "Item Owner",
      valueGetter: (params: Employee) => {
        return params
          ? `${params.LASTNAME.toUpperCase()}, ${params.FIRSTNAME.toUpperCase()} ${
              params?.MIDDLENAME?.toUpperCase() ?? ""
            } ${params?.SUFFIX?.toUpperCase() ?? ""}`
          : "Failed to Retrieved name";
      },
      width: 180,
    },
    {
      field: "approvedByEmpDetails",
      headerName: "Approved By",
      valueGetter: (params: Employee) =>
        `${params?.LASTNAME ?? ""} ${params?.FIRSTNAME ?? ""} ${
          params?.MIDDLENAME ?? ""
        } ${params?.SUFFIX ?? ""}`,
      width: 180,
    },
    {
      field: "borrowerEmp",
      headerName: "Borrower",
      valueGetter: (params: Employee) => {
        return params
          ? `${params.LASTNAME ?? ""}, ${params.FIRSTNAME ?? ""} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "--";
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
      field: "transactionRemarksDetails",
      headerName: "Transaction",
      width: 200,
      valueGetter: (params: TransactionRemarksProp) =>
        params?.DESCRIPTION ?? "--",
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
              variant="outlined"
              onClick={() => handleOpenModalConfirmationReject(params.row.id)}
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4 ||
                params.row.status === 5
              }
            />
            <DefaultButton
              btnText="approve"
              onClick={() => handleOpenModalConfirmationApprove(params.row.id)}
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

  //render transaction pdf
  const handlePDFPreview = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/pdfkit`,
        { requestRows: borrowingTransactions },
        {
          responseType: "blob",
        }
      );

      //crete blob pdf response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfURL = URL.createObjectURL(blob);

      window.open(pdfURL, "_blank");
    } catch (error) {
      console.error("Failed to preview PDF. ", error);
    }
  };

  //console log the borrow transactions
  useEffect(() => {
    if (borrowingTransactions) {
      console.log("borrowing transactions ", borrowingTransactions);
    }
  }, [borrowingTransactions]);

  // if (isLoading) {
  //   return (
  //     <span className="animate-pulse dead-center text-base font-semibold">
  //       Loading...
  //     </span>
  //   );
  // }

  return (
    <>
      <div className="flex justify-between items-start">
        <PageHeader pageHead="Requests" />
        <Tooltip title={<span className="text-lg">Preview PDF</span>}>
          <button onClick={handlePDFPreview}>
            <PictureAsPdf />
          </button>
        </Tooltip>
      </div>
      <DataTable
        columns={columns}
        rows={borrowingTransactions}
        loading={isLoading}
        sx={{
          "& .cell-approved": { backgroundColor: "#90ee90 ", color: "#333" }, // Light green
          "& .cell-rejected": { backgroundColor: "#d0312d", color: "#fff" }, // Light red
          "& .cell-pending": { backgroundColor: "#fcf4a3", color: "#333" }, // green yellow
          "& .cell-cancel": { backgroundColor: "#d8bfd8", color: "#333" }, // thirstle: purple
        }}
      />
      <ConfirmModalApprove
        open={openModalApprove}
        close={handleCloseModalApprove}
        handleApproveTransaction={handleApproveTransaction}
        isLoading={isApproveLoading}
      />
      <ConfirmModalReject
        open={openModalReject}
        close={handleCloseModalReject}
        handleRejectTransaction={handleRejectTransaction}
        isLoading={isRejectloading}
      />
    </>
  );
};

export default Requests;
