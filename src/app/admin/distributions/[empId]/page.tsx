"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetEmployeeByIdQuery,
  useGetUnDistributeItemQuery,
} from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React from "react";

const Distribute = () => {
  //use hooks
  //emp reciever id params
  const { empId } = useParams();

  //get emp receiver
  const { data: empReceiver, isLoading: isEmpRecLoading } =
    useGetEmployeeByIdQuery(Number(empId));

  //user details
  const { empDetails } = useAuth();

  const { data: undistributedItems, isLoading: isItemsLoading } =
    useGetUnDistributeItemQuery(Number(empDetails?.CURRENT_DPT_ID));

  const columns: GridColDef[] = [
    { field: "ITEM_NAME", headerName: "Item name", width: 135 },
    {
      field: "Quantity",
      headerName: "Quantity",
      width: 95,
      renderCell: (params) =>
        `${params.row.STOCK_QUANTITY}/${params.row.ORIGINAL_STOCK}`,
    },
    { field: "DESCRIPTION", headerName: "Description", width: 140 },
    { field: "UNIT_VALUE", headerName: "Unit value", width: 95 },
    { field: "TOTAL_VALUE", headerName: "Total value", width: 95 },
    { field: "SERIAL_NO", headerName: "Serial #", width: 135 },
    { field: "PROP_NO", headerName: "Prop #", width: 140 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader pageHead="Select the one item to distribute" />
      <div className="flex gap-2 mb-4">
        <h1 className="text-base font-semibold">Receiver: </h1>
        {!isEmpRecLoading && empReceiver && (
          <div className="text-base">
            <span className=" underline underline-offset-4">
              {empReceiver.LASTNAME}, {empReceiver.FIRSTNAME}{" "}
              {empReceiver.SUFFIX ?? ""}
              {empReceiver.MIDDLENAME ?? ""}
            </span>
          </div>
        )}
      </div>
      <DataGrid
        rows={undistributedItems}
        columns={columns}
        getRowId={(params) => params.ID}
        loading={isItemsLoading}
        sx={{ height: 400 }}
      />

      <div className="w-full bg-red-500 h-80"></div>
    </div>
  );
};

export default Distribute;
