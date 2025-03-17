"use client";

import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetOwnApprovedTransactionQuery } from "@/features/api/apiSlice";
import { Employee, UndistributedItem } from "@/types/global_types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";

const OnLendItems = () => {
  const { empDetails } = useAuth();

  const { data, isLoading } = useGetOwnApprovedTransactionQuery({
    empId: Number(empDetails?.ID),
  });

  const columns: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Item",
      width: 180,
      valueGetter: (params: UndistributedItem) => `${params.ITEM_NAME}`,
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
      width: 180,
      type: "dateTime",
      valueGetter: (params) => new Date(params),
    },
  ];

  //   useEffect(() => {
  //     if (data) {
  //       console.log("Data ", data);
  //     }
  //   }, [data]);

  return (
    <>
      <PageHeader pageHead="On Lend Items" />
      <div className="h-[400px]">
        <DataTable loading={isLoading} rows={data} columns={columns} />
      </div>
    </>
  );
};

export default OnLendItems;
