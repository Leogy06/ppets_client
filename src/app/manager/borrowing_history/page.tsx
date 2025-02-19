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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

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

  const handleEditBorrowTransaction = async (
    borrowId: number,
    status: number
  ) => {
    if (status === 0) {
      openSnackbar("Status should not be zero or null.", "error");
      return;
    }

    try {
      const result = await editBorrowingTransaction({
        borrowId,
        updateEntry: status,
      }).unwrap();

      console.log("result ", result);
    } catch (error) {
      console.error("Unable to edit the transaction.", error);
      handleError(error, "Unable to edit the transaction.");
    }
  };

  const columns: GridColDef[] = [
    { field: "borrowedItem", headerName: "Borrowed Item", width: 180 },
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
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex gap-2 items-center p-1">
            <DefaultButton
              btnText="approve"
              onClick={() => handleEditBorrowTransaction(params.row.id, 1)}
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4
              }
            />
            <DefaultButton
              btnText="reject"
              disabled={
                params.row.status === 1 ||
                params.row.status === 3 ||
                params.row.status === 4
              }
              color="secondary"
              onClick={() => handleEditBorrowTransaction(params.row.id, 4)}
            />
          </div>
        );
      },
    },
  ];

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
    </>
  );
};

export default BorrowingHistory;
