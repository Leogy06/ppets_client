"use client";
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetItemsNotOwnedQuery } from "@/features/api/apiSlice";
import { Item, UndistributedItem } from "@/types/global_types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RequestItem = () => {
  //use auth
  const { empDetails } = useAuth();
  //use get items by owner
  const {
    data: items,
    isLoading,
    error,
  } = useGetItemsNotOwnedQuery({
    empId: Number(empDetails?.ID),
    departmentId: Number(empDetails?.CURRENT_DPT_ID),
  });

  const router = useRouter();

  //column grid
  const column: GridColDef[] = [
    { field: "id", headerName: "ID", width: 30 },

    {
      field: "itemDetails",
      headerName: "Item",
      width: 180,
      valueGetter: (param: UndistributedItem) => param.ITEM_NAME ?? "--",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      type: "number",
    },
    {
      field: "unit_value",
      headerName: "Unit value",
      width: 100,
      type: "number",
    },
    {
      field: "total_value",
      headerName: "Total value",
      width: 120,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
    },
    {
      field: "DISTRIBUTED_BY",
      headerName: "Distributed by",
      width: 120,
    },
    {
      field: "DISTRIBUTED_ON",
      headerName: "Distributed on",
      type: "dateTime",
      width: 150,
      valueGetter: (params: Item["DISTRIBUTED_ON"]) =>
        params ? new Date(params) : "--",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex gap-1">
            <DefaultButton
              btnText="request"
              onClick={() => {
                router.push(`/manager/request_item/${params.row.id}`);
              }}
            />
            <DefaultButton btnText="cancel" color="secondary" />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (items) {
      console.log("items ", items);
    } else {
      console.log("error ", error);
    }
  }, [items]);

  return (
    <>
      <PageHeader pageHead="Request Item" />
      <DataGrid rows={items} columns={column} loading={isLoading} />
    </>
  );
};

export default RequestItem;
