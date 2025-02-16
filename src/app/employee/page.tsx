"use client";

import React from "react";
import PageHeader from "@/app/(component)/pageheader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetBorrowingTransactionByBorrowerQuery } from "@/features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";

const Employee = () => {
  const { empDetails } = useAuth();
  const { data, isLoading } = useGetBorrowingTransactionByBorrowerQuery({
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
      headerName: "Custodian",
      width: 180,
      valueGetter: (params: { LASTNAME: string; FIRSTNAME: string }) =>
        params ? `${params.LASTNAME}, ${params.FIRSTNAME}` : "Unknown Owner",
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
      width: 100,
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

  return (
    <>
      <PageHeader pageHead="Request Item" />
      <DataGrid rows={data} columns={columns} loading={isLoading} />
    </>
  );
};

export default Employee;
