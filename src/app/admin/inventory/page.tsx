"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetUnDistributeItemQuery } from "@/features/api/apiSlice";
import {
  AddBoxOutlined,
  CreateOutlined,
  Inventory2Outlined,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Inventory = () => {
  //use hooks
  //router
  const router = useRouter();
  //employee details
  const { empDetails } = useAuth();

  //get undistributed items
  const { data: undistributtedItems, isLoading: isUndistributeLoading } =
    useGetUnDistributeItemQuery(Number(empDetails?.CURRENT_DPT_ID));

  //data grid column
  const columns: GridColDef[] = [
    { field: "ITEM_NAME", headerName: "Item Name", width: 120 },
    {
      field: "ORIGINAL_STOCK",
      headerName: "Quantity",
      type: "number",
    },
    {
      field: "STOCK_QUANTITY",
      headerName: "Remaining",
      type: "number",
    },

    {
      field: "UNIT_VALUE",
      headerName: "Unit value",
      type: "number",
      renderCell: (params) => (params ? ` ₱ ${params.row.UNIT_VALUE}` : "--"),
    },
    {
      field: "TOTAL_VALUE",
      headerName: "Total value",
      width: 110,
      type: "number",
      renderCell: (params) => (params ? ` ₱ ${params.row.TOTAL_VALUE}` : "--"),
    },
    { field: "REMARKS", headerName: "Remarks", width: 180 },
    {
      field: "RECEIVED_AT",
      headerName: "Recieved on",
      width: 180,
      type: "dateTime",
      valueGetter: (params) => new Date(params) ?? "--",
    },
  ];

  // useEffect(() => {
  //   if (undistributtedItems) {
  //     console.log("undistrivbute items ", undistributtedItems);
  //   }
  // }, [undistributtedItems]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <PageHeader pageHead="Inventory" icon={Inventory2Outlined} />
        <DefaultButton
          btnIcon={<AddBoxOutlined />}
          title="Add item"
          onClick={() => router.push("/admin/inventory/add")}
        />
      </div>
      <DataGrid
        rows={undistributtedItems}
        columns={columns}
        getRowId={(params) => params.ID}
        loading={isUndistributeLoading}
      />
    </>
  );
};

export default Inventory;
