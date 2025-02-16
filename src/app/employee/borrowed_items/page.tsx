"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useGetItemsQuery } from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

const ItemList = () => {
  const { data: items, isLoading } = useGetItemsQuery();
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item", width: 180 },
    { field: "description", headerName: "Description", width: 240 },
    { field: "quantity", headerName: "On hand" },
    { field: "accountable_emp", headerName: "Custodian", width: 180 },
    {
      field: "itemCustodian",
      headerName: "Item custodian",
      width: 200,
      valueGetter: (params: { LASTNAME: string; FIRSTNAME: string }) =>
        `${params.LASTNAME}, ${params.FIRSTNAME}`,
    },
  ];
  return (
    <div className="flex flex-col">
      <PageHeader pageHead="Items" />
      <DataGrid rows={items} columns={columns} loading={isLoading} />
    </div>
  );
};

export default ItemList;
