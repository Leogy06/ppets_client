"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetItemsDepartmentQuery } from "@/features/api/apiSlice";
import { Employee, ItemStatus } from "@/types/global_types";
import { Inventory2Outlined } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

const Inventory = () => {
  //use hooks
  const { empDetails } = useAuth();
  const { data: items, isLoading: isItemLoading } = useGetItemsDepartmentQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  const columns: GridColDef[] = [
    { field: "name", headerName: "Item", width: 120 },
    { field: "remarks", headerName: "Remarks", width: 180 },
    { field: "quantity", headerName: "Quantity", width: 120, type: "number" },
    {
      field: "ownerEmpDetails",
      headerName: "Owned by: ",
      width: 220,
      valueGetter: (params: Employee) =>
        params
          ? `${params.LASTNAME} ${params.FIRSTNAME} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "Unknown Owner",
    },
    {
      field: "unit_value",
      headerName: "Unit value",
      width: 100,
      type: "number",
      renderCell: (params) => (params ? `₱ ${params.row.unit_value}` : "--"),
    },
    {
      field: "total_value",
      headerName: "Total Value",
      width: 120,
      type: "number",
      renderCell: (params) => (params ? `₱ ${params.row.total_value}` : "--"),
    },
    {
      field: "itemStatusDetails",
      headerName: "Condition",
      width: 100,
      valueGetter: (params: ItemStatus) =>
        params ? params.DESCRIPTION.toUpperCase() : "--",
    },
  ];

  //log items
  // useEffect(() => {
  //   if (items) {
  //     console.log("items ", items);
  //   }
  // }, [items]);

  return (
    <>
      <PageHeader pageHead="Inventory" icon={Inventory2Outlined} />
      <DataGrid columns={columns} rows={items} loading={isItemLoading} />
    </>
  );
};

export default Inventory;
