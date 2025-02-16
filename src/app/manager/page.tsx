"use client";

import { useAuth } from "@/context/AuthContext";
import { useGetItemsByOwnerQuery } from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
<<<<<<< HEAD
import PageHeader from "../(component)/pageheader";
=======
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
import DefaultButton from "../(component)/buttonDefault";
import { useRouter } from "next/navigation";

const ManagerPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const router = useRouter();

  const {
    data: ownedItems,
    isLoading,
    isError,
  } = useGetItemsByOwnerQuery(user?.emp_id);
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item name", width: 230 },
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
    { field: "status", headerName: "STATUS", width: 75, editable: true },
    {
      field: "category_item",
      headerName: "CATEGORY",
      width: 250,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Added at#",
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

  if (isError) {
    return <div className="text-red-500 ">Error fetching items...</div>;
  }

  return (
    <>
<<<<<<< HEAD
      <PageHeader pageHead="Items in Custody" />

      <div className="mb-4 flex justify-end">
=======
      <DataGrid
        columns={columns}
        rows={ownedItems}
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "linear-progress",
          },
        }}
      />
      <div className="flex justify-end mt-4">
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
        <DefaultButton
          btnText="add item"
          onClick={() => router.push("/manager/add_item")}
        />
      </div>
<<<<<<< HEAD
      <DataGrid
        columns={columns}
        rows={ownedItems}
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "linear-progress",
          },
        }}
      />
=======
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
    </>
  );
};

export default ManagerPage;
