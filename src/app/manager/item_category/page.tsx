"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import {
  useEditCategoryItemMutation,
  useGetItemCategoriesQuery,
} from "@/features/api/apiSlice";
import { ItemCategory as ItemCategoryProps } from "@/types/global_types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

const ItemCategory = () => {
  const router = useRouter();
  const { data: itemCategories, isLoading } = useGetItemCategoriesQuery({});

  //handle edit item category
  const [editItemCategory] = useEditCategoryItemMutation();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
    },
  ];

  const handleRowEdit = async (newRow: ItemCategoryProps) => {
    const { id, description } = newRow;
    console.log("new row: ", newRow);

    try {
      await editItemCategory({
        id,
        description,
      }).unwrap();

      return { ...newRow };
    } catch (error) {
      console.error(error);
      return {
        ...itemCategories?.find((row: ItemCategoryProps) => row.id === id),
      };
    }
  };

  return (
    <>
      <PageHeader pageHead="Item Category" />
      <div className="flex items-end justify-end mb-4">
        <DefaultButton
          btnText="add category"
          onClick={() => router.push("/manager/item_category/add")}
        />
      </div>
      <DataGrid
        rows={itemCategories || []}
        columns={columns}
        loading={isLoading}
        processRowUpdate={(newRow) => handleRowEdit(newRow)}
        onProcessRowUpdateError={(error) =>
          console.error("Edit Error: ", error)
        }
      />
    </>
  );
};

export default ItemCategory;
