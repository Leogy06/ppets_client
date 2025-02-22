"use client";

import { useAuth } from "@/context/AuthContext";
import {
  useEditItemMutation,
  useGetItemsByOwnerQuery,
} from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import PageHeader from "@/app/(component)/pageheader";
import DefaultButton from "@/app/(component)/buttonDefault";
import { useRouter } from "next/navigation";
import { Item, ItemCategory, ItemStatus } from "@/types/global_types";

const ManagerPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: ownedItems,
    isLoading,
    isError,
  } = useGetItemsByOwnerQuery(user?.emp_id);

  //edit items
  const [editItem] = useEditItemMutation();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Item name", width: 230, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity on hand",
      width: 250,
      type: "number",
      editable: true,
    },
    { field: "ics", headerName: "ICS#", width: 170, editable: true },
    { field: "are_no", headerName: "ARE#", width: 130, editable: true },
    { field: "prop_no", headerName: "PROP#", width: 120, editable: true },
    {
      field: "unit_value",
      headerName: "Unit Value",
      width: 90,
      type: "number",
      editable: true,
    },
    {
      field: "total_value",
      headerName: "Total Value",
      width: 90,
      type: "number",
      editable: true,
    },
    {
      field: "itemStatusDetails",
      headerName: "STATUS",
      width: 90,
      valueGetter: (params: ItemStatus) =>
        params?.DESCRIPTION.toUpperCase() ?? "Unknown Status.",
    },
    {
      field: "categoryItemDetails",
      headerName: "CATEGORY",
      width: 250,
      editable: true,
      valueGetter: (params: ItemCategory) =>
        params?.description ?? "Unknown Item Category",
    },
    {
      field: "createdAt",
      headerName: "Added at",
      width: 150,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : null),
    },
    {
      field: "updatedAt",
      headerName: "Updated at",
      width: 150,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : null),
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

  if (isError) {
    return <div className="text-red-500 ">Error fetching items...</div>;
  }

  return (
    <>
      <PageHeader pageHead="Items in Custody" />
      <div className="mb-4 flex justify-end">
        <DefaultButton
          btnText="add item"
          onClick={() => router.push("/manager/add_item")}
        />
      </div>
      <DataGrid
        columns={columns}
        rows={ownedItems}
        loading={isLoading}
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
