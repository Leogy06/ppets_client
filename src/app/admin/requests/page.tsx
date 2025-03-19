"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useApproveReturnTransactionMutation,
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
import React, { useState } from "react";

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

//confirm return modal
const ConfirmReturnApproveModal = ({
  open,
  close,
  handleApproveReturnTransaction,
}: {
  open: boolean;
  close: () => void;
  handleApproveReturnTransaction: () => void;
}) => {
  return (
    <DefaultModal open={open} onClose={close}>
      <h1 className="text-lg font-bold">Confirm Approve Return Item?</h1>
      <p> Are you sure you want to approve return this item? </p>
      <div className="flex gap-1 justify-end">
        <DefaultButton btnText="cancel" variant="text" onClick={close} />
        <DefaultButton
          btnText="confirm"
          onClick={handleApproveReturnTransaction}
        />
      </div>
    </DefaultModal>
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

  //open modal approve return item
  const [openModalReturnApprove, setOpenModalReturnApprove] = useState(false);

  //transaction id state
  const [transactionId, setTransactionId] =
    useState<BorrowingTransactionTypes["id"]>(null);

  //use approve return transaction
  const [approveReturnTransaction, { isLoading: isApproveReturnLoading }] =
    useApproveReturnTransactionMutation();

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

  //open return modal
  const handleOpenReturnModal = (
    transactionId: BorrowingTransactionTypes["id"]
  ) => {
    setTransactionId(transactionId);
    setOpenModalReturnApprove(true);
  };

  //handle approve return transaction
  const handleApproveReturnTransaction = async () => {
    try {
      const result = await approveReturnTransaction(transactionId).unwrap();

      openSnackbar(result?.message ?? "Transaction approved. ", "success");
    } catch (error) {
      console.error("Unable to approve return transaction.", error);

      const errMsg = handleError(
        error,
        "Unable to approve return transaction."
      );
      openSnackbar(errMsg, "error");
    }
  };

  //handle close accept return modal
  const handleCloseReturnModal = () => {
    setTransactionId(null);
    setOpenModalReturnApprove(false);
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
      field: "Actions",
      headerName: "Actions",
      width: 400,
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
            {/* approve return button
             */}
            <DefaultButton
              btnText="accept return"
              onClick={() => handleOpenReturnModal(params.row.id)}
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
          withCredentials: true,
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
  // useEffect(() => {
  //   if (borrowingTransactions) {
  //     console.log("borrowing transactions ", borrowingTransactions);
  //   }
  // }, [borrowingTransactions]);

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
      {/* confirm accpet return */}
      <ConfirmReturnApproveModal
        open={openModalReturnApprove}
        close={handleCloseReturnModal}
        handleApproveReturnTransaction={handleApproveReturnTransaction}
      />
    </>
  );
};

export default Requests;
