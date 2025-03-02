"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetBorrowingTransactionByOwnerQuery } from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";

const RequestItem = () => {
  //use auth
  const { empDetails } = useAuth();

  //use get requests related to this user
  const { data: itemRequests, isLoading: itemRequestsLoading } =
    useGetBorrowingTransactionByOwnerQuery({ empId: empDetails?.ID });

  //column grid
  const column: GridColDef[] = [];

  useEffect(() => {
    if (itemRequests) {
      console.log("Requests ", itemRequests);
    }
  }, [itemRequests]);

  return (
    <>
      <PageHeader pageHead="Request Item" />
      <DataGrid
        rows={itemRequests}
        columns={column}
        loading={itemRequestsLoading}
      />
    </>
  );
};

export default RequestItem;
