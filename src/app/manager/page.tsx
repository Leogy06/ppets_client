"use client";

import { useAuth } from "@/context/AuthContext";
import {
  useEditItemMutation,
  useGetItemsByOwnerQuery,
} from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { useRouter } from "next/navigation";
import { Item, UndistributedItem } from "@/types/global_types";
import DefaultButton from "../(component)/buttonDefault";

const ManagerPage = () => {
  const { user } = useAuth();

  const {
    data: ownedItems,
    isLoading,
    isError,
  } = useGetItemsByOwnerQuery(user?.emp_id);

  //edit items
  const [editItem] = useEditItemMutation();

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
            />
          </div>
        );
      },
    },
  ];

  //edit tow
  const handleRowEdit = async (newRow: Item) => {
    const { id, ...updatedFields } = newRow;

    try {
      await editItem({ id, data: updatedFields });

      return { ...newRow };
    } catch (error) {
      console.error("Unable to Edit Item. ", error);
      return { ...ownedItems.find((row: Item) => row.id === id) };
    }
  };

  useEffect(() => {
    if (ownedItems) {
      console.log("owned items ", ownedItems);
    }
  }, [ownedItems]);

  if (isError) {
    return <div className="text-red-500 ">Error fetching items...</div>;
  }

  return (
    <>
      <PageHeader pageHead="Items" />

      <DataGrid
        columns={columns}
        rows={ownedItems}
        loading={isLoading}
        getRowId={(params) => params.id}
        processRowUpdate={(newRow) => handleRowEdit(newRow)}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "linear-progress",
          },
        }}
      />
    </>
  );
};

export default ManagerPage;
