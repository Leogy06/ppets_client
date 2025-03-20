"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useApproveTransferItemTransactionMutation,
  useGetBorrowingTransactionByDptQuery,
} from "@/features/api/apiSlice";
import {
  BorrowingTransactionTypes,
  Employee,
  Item,
  UndistributedItem,
} from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo } from "react";

//confirm transfer items
const ConfirmTransferItems = ({
  open,
  onClose,
  selectedItem,
  empReceiver,
}: {
  open: boolean;
  onClose: () => void;
  selectedItem: UndistributedItem;
  empReceiver: Employee;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="max-h-[70vh]">
        <h1 className="text-lg font-bold">Transfer Items</h1>
        <p>Are you sure you want to transfer this item?</p>
        <div>
          <p>Item: {selectedItem.ITEM_NAME}</p>
          <p>Receiver: {empReceiver.fullName}</p>
        </div>
      </div>
    </DefaultModal>
  );
};

const TransferItems = () => {
  const { empDetails } = useAuth();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //use get borroweing transaction query
  const { data: transferRequests, isLoading: isTransferRequestsLoading } =
    useGetBorrowingTransactionByDptQuery(empDetails?.CURRENT_DPT_ID);

  //use paprove transaction api
  const [approveTransferTransaction] =
    useApproveTransferItemTransactionMutation();

  //handle approve transfer transaction
  const handleApproveTransferTransaction = async (transactionId: number) => {
    try {
      const result = await approveTransferTransaction({
        transactionId,
        approverId: empDetails?.ID,
      }).unwrap();

      openSnackbar(result.message ?? "Transaction approved. ", "success");
    } catch (error) {
      console.error("Unable to approve transaction.", error);

      const errMsg = handleError(error, "Unable to approve transaction.");
      openSnackbar(errMsg, "error");
    }
  };

  //data table column
  const columns: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Item",
      width: 180,
      valueGetter: (params: UndistributedItem) =>
        `${params?.ITEM_NAME ?? "N/A"}`,
    },
    { field: "quantity", headerName: "Quantity", width: 90, type: "number" },
    {
      field: "borrowerEmp",
      headerName: "Borrowed By",
      width: 200,
      valueGetter: (params: Employee) =>
        `${params?.LASTNAME ?? ""} ${params?.FIRSTNAME ?? ""} ${
          params?.MIDDLENAME ?? ""
        } ${params?.SUFFIX ?? ""}`,
    },
    { field: "remarks", headerName: "Remarks", width: 180 },
    {
      field: "createdAt",
      headerName: "Requested On:",
      type: "dateTime",
      width: 300,
      valueGetter: (params) => new Date(params),
    },
    {
      field: "Actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 190,
      renderCell: (params) => (
        <div className="flex justify-center">
          <DefaultButton
            btnText="select"
            onClick={() => console.log(params.row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (transferRequests) {
      console.log("transferRequests ", transferRequests);
    }
  }, [transferRequests]);

  //filtered to transfer transaction requests
  const transferredRequests = useMemo(() => {
    return transferRequests?.filter(
      (request: BorrowingTransactionTypes) => request?.remarks === "4" //transfer
    );
  }, [transferRequests]);

  return (
    <>
      <PageHeader pageHead="Transfer Items" />
      <DataTable
        rows={transferredRequests}
        columns={columns}
        loading={isTransferRequestsLoading}
      />
    </>
  );
};

export default TransferItems;
