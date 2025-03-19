"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetBorrowingTransactionByDptQuery } from "@/features/api/apiSlice";
import {
  BorrowingTransactionTypes,
  Employee,
  UndistributedItem,
} from "@/types/global_types";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo } from "react";

const TransferItems = () => {
  const { empDetails } = useAuth();

  //use get borroweing transaction query
  const { data: transferRequests, isLoading: isTransferRequestsLoading } =
    useGetBorrowingTransactionByDptQuery(empDetails?.CURRENT_DPT_ID);

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
