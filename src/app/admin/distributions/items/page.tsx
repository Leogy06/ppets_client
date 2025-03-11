"use client";

import BackArrow from "@/app/(component)/backArrow";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetItemsDepartmentQuery } from "@/features/api/apiSlice";
import { UndistributedItem } from "@/types/global_types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";

const DistributedItems = () => {
  const { empDetails } = useAuth();

  const { data: distributedItems, isLoading: isItemsLoading } =
    useGetItemsDepartmentQuery(Number(empDetails?.CURRENT_DPT_ID));

  const columns: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Item Description",
      width: 200,
      valueGetter: (params: UndistributedItem) => params?.ITEM_NAME ?? "--",
    },

    { field: "quantity", headerName: "Quantity", width: 130 },
    {
      field: "DISTRIBUTED_ON",
      headerName: "Date Acquired",
      width: 180,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : null),
    },
    {
      field: "are_no",
      headerName: "Are No.",
      width: 110,
    },
    {
      field: "pis_no",
      headerName: "PIC No.",
      width: 110,
    },
    {
      field: "ics #",
      headerName: "ICS No.",
      width: 110,
      renderCell: (params) => {
        const { itemDetails } = params.row;

        return itemDetails?.PIC_NO ?? "--";
      },
    },
    {
      //prop no
      field: "prop item",
      headerName: "Property No.",
      renderCell: (params) => {
        const { itemDetails } = params.row;

        return itemDetails?.PROP_NO ?? "--";
      },
      width: 110,
    },
    {
      field: "serial no",
      headerName: "Serial No.",
      width: 110,
      renderCell: (params) => {
        const { itemDetails } = params.row;

        return itemDetails?.SERIAL_NO ?? "--";
      },
    },
    {
      field: "class_no",
      headerName: "Class No.",
      width: 110,
    },
    {
      field: "unit_value",
      headerName: "Unit Value",
      width: 120,
    },
    {
      field: "total_value",
      headerName: "Total Value",
      width: 130,
    },
    {
      field: "accountableEmpDetails",
      headerName: "Accountable Person",
      width: 180,
    },
  ];

  useEffect(() => {
    if (distributedItems) {
      console.log("distributed items ", distributedItems);
    }
  }, [distributedItems]);

  return (
    <>
      <PageHeader pageHead="Distributed Items" />
      <div className="mb-4">
        <BackArrow backTo="/admin/distributions" />
      </div>
      <div className="h-[400px]">
        <DataGrid
          loading={isItemsLoading}
          columns={columns}
          disableRowSelectionOnClick
          rows={distributedItems?.map((item) => ({
            ...item,
            accountableEmpDetails: `${item.accountableEmpDetails.FIRSTNAME.toUpperCase()} ${item.accountableEmpDetails.LASTNAME.toUpperCase()} ${
              item.accountableEmpDetails?.MIDDLENAME?.toUpperCase() ?? ""
            } ${item.accountableEmpDetails?.SUFFIX?.toUpperCase() ?? ""}`,
          }))}
        />
      </div>
    </>
  );
};

export default DistributedItems;
