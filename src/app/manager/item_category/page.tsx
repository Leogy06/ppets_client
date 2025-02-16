"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useGetItemCategoriesQuery } from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

const ItemCategory = () => {
  const router = useRouter();
  const { data: itemCategories, isLoading } = useGetItemCategoriesQuery({});
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "description", headerName: "Description" },
  ];
  return (
    <>
      <PageHeader pageHead="Item Category" />
      <div className="flex items-end justify-end mb-4">
        <DefaultButton
          btnText="add category"
          onClick={() => router.push("/manager/item_category/add")}
        />
      </div>
      <DataGrid rows={itemCategories} columns={columns} loading={isLoading} />
    </>
  );
};

export default ItemCategory;
