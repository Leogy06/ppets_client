"use client";

import { useAuth } from "@/context/AuthContext";
import { useGetItemsByOwnerQuery } from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { UndistributedItem } from "@/types/global_types";
import DefaultButton from "../(component)/buttonDefault";
import { useRouter } from "next/navigation";

const ManagerPage = () => {
  const { user } = useAuth();

  const {
    data: ownedItems,
    isLoading,
    isError,
  } = useGetItemsByOwnerQuery(user?.emp_id);

  // use router
  const router = useRouter();

  //use states

  const columns: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Item",
      valueGetter: (params: UndistributedItem) => params.ITEM_NAME,
      width: 180,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      renderCell: (params) =>
        `${params.row.quantity} / ${
          params.row.ORIGINAL_QUANTITY ?? " Unknown"
        }`,
    },
    {
      field: "unit_value",
      headerName: "Unit value",
      type: "number",
      width: 78,
    },
    {
      field: "total_value",
      headerName: "Total value",
      width: 90,
    },
    {
      field: "DISTRIBUTED_ON",
      headerName: "Distrbuted on",
      width: 180,
      valueGetter: (params) => (params ? new Date(params) : "--"),
    },
    {
      field: "DISTRIBUTED_BY",
      headerName: "Distributed by",
      width: 120,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <DefaultButton
              btnText="Lend"
              color="secondary"
              title="Lend this Item"
              onClick={() => router.push(`/manager/lend/${params.row.id}`)}
            />
          </div>
        );
      },
    },
  ];

  // useEffect(() => {
  //   if (ownedItems) {
  //     console.log("owned items ", ownedItems);
  //   }
  // }, [ownedItems]);

  if (isError) {
    return <div className="text-red-500 ">Error fetching items...</div>;
  }

  return (
    <>
      <PageHeader pageHead="Items" />
      <DataGrid rows={ownedItems} columns={columns} loading={isLoading} />
    </>
  );
};

export default ManagerPage;
