"use client";

import React, { useEffect } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  useEditBorrowingTransactionMutation,
  useGetBorrowingTransactionByBorrowerQuery,
  useGetStatusProcessQuery,
} from "@/features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { Employee as EmployeeProps, Item } from "@/types/global_types";
import DefaultButton from "@/app/(component)/buttonDefault";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { handleError } from "@/utils/errorHandler";

const Employee = () => {
  const { empDetails } = useAuth();
  const { data: borrowingTransactions, isLoading } =
    useGetBorrowingTransactionByBorrowerQuery({
      empId: empDetails?.ID,
    });

  //editing borrow transaction
  const [editBorrowingTransaction] = useEditBorrowingTransactionMutation();

  //process status
  const { data: processStatus, isLoading: isPrcsStsLdng } =
    useGetStatusProcessQuery();

  //snackbar
  const { openSnackbar } = useSnackbar();

  const handleClickCancel = async (borrowId: number, status: number) => {
    if (status === 0) {
      openSnackbar("Status should not be zero or null", "error");

      return;
    }

    try {
      await editBorrowingTransaction({
        borrowId,
        updateEntry: status,
      });
    } catch (error) {
      console.error("Unable to cancel the requested item.", error);
      const errMsg = handleError(error, "Unable to cancel the requested item.");
      openSnackbar(errMsg, "error");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "borrowedItemDetails",
      headerName: "Item",
      width: 180,
      valueGetter: (params: Item) =>
        params ? params.name : "Unable to get name",
    },
    { field: "quantity", headerName: "Quantity", width: 70 },
    {
      field: "ownerEmp",
      headerName: "Owner",
      width: 180,
      valueGetter: (params: EmployeeProps) =>
        `${params ? params.LASTNAME : "Unknown"}, ${
          params.FIRSTNAME ?? "Unknown"
        } ${params.MIDDLENAME ?? ""} ${params.SUFFIX ?? ""}`,
    },

    {
      field: "createdAt",
      headerName: "Date of Borrow",
      width: 180,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : ""),
    },
    {
      field: "status",
      headerName: "Borrowing Status",
      width: 180,
      valueGetter: (params) =>
        !isPrcsStsLdng &&
        processStatus
          ?.find((status) => status.id === params)
          ?.description.toUpperCase(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2">
            <DefaultButton
              btnText="cancel"
              color="secondary"
              title="Cancel Requested Item."
              onClick={() => handleClickCancel(params.row.id, 3)}
              disabled={
                params.row.status === 4 ||
                params.row.status === 3 ||
                params.row.status === 1 ||
                params.row.status === 5
              }
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (borrowingTransactions) {
      console.log("transactions: ", borrowingTransactions);
    }
  }, [borrowingTransactions]);

  return (
    <>
      <PageHeader pageHead="Borrowing History" />
      <DataGrid
        rows={borrowingTransactions}
        columns={columns}
        loading={isLoading}
        sx={{ height: 400 }}
      />
    </>
  );
};

export default Employee;
