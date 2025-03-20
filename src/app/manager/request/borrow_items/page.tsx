"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetItemsNotOwnedQuery } from "@/features/api/apiSlice";
import { mapDistributedItems } from "@/utils/arrayUtils";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";

const BorrowItem = () => {
  const { empDetails } = useAuth();
  const { data: items, isLoading: isItemLoading } = useGetItemsNotOwnedQuery({
    empId: Number(empDetails?.ID),
    departmentId: Number(empDetails?.CURRENT_DPT_ID),
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "itemName",
      headerName: "Item",
      width: 200,
    },
    {
      field: "itemPar",
      headerName: "PAR",
      width: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
    },
    {
      field: "accountableEmp",
      headerName: "Accountable Employee",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center gap-1">
          <DefaultButton
            btnText="select"
            title="Borrow this Item"
            placement="left"
          />
        </div>
      ),
    },
  ];

  const mappedDistributeditem = mapDistributedItems(items || []);

  return (
    <>
      <PageHeader pageHead="Borrow Items" />
      <DataTable
        columns={columns}
        rows={mappedDistributeditem}
        loading={isItemLoading}
      />
    </>
  );
};

export default BorrowItem;
