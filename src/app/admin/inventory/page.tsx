"use client";

import { useGetItemsQuery } from "@/features/api/apiSlice";
import { Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

const Inventory = () => {
  const router = useRouter();
  const {
    data: items,
    isLoading: isItmRdy,
    isError: isErrItm,
  } = useGetItemsQuery();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 180, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      type: "number",
      editable: true,
    },
    {
      field: "emp_ownder",
      headerName: "Owner",
      width: 170,
      valueGetter: (params) => (params ? params : "Not owned"),
    },
    { field: "ics", headerName: "ICS#", width: 170, editable: true },
    { field: "are_no", headerName: "ARE#", width: 130, editable: true },
    { field: "prop_no", headerName: "PROP#", width: 120, editable: true },
    { field: "value", headerName: "VALUE", width: 90, editable: true },
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

  if (isItmRdy) {
    return <div className="animate-pulse text-lg">Loading...</div>;
  }

  if (isErrItm) {
    return <div className="text-red-500">Error fetching item...</div>;
  }

  return (
    <>
      <Paper sx={{ width: "100%", height: 400 }}>
        <DataGrid columns={columns} rows={items} />
      </Paper>
      <Button
        variant="contained"
        sx={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem" }}
        onClick={() => router.push("/admin/inventory/add")}
      >
        add item
      </Button>
    </>
  );
};

export default Inventory;
