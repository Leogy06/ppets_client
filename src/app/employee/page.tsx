"use client";

import React, { useEffect } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetBorrowingTransactionByBorrowerQuery } from "@/features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { Employee as EmployeeProps } from "@/types/global_types";

const Employee = () => {
  const { empDetails } = useAuth();
  const { data: borrowingTransactions, isLoading } =
    useGetBorrowingTransactionByBorrowerQuery({
      empId: empDetails?.ID,
    });

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Item",
      width: 180,
      valueGetter: (params: { name: string }) =>
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
        params === 1
          ? "Pending"
          : params === 2
          ? "Approved"
          : params === 3
          ? "Returned"
          : "Unknown status",
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
