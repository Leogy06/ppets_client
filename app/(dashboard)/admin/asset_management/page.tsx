"use client";

import React from "react";
import { DataTable } from "./data-table";
import { useGetItemsQuery } from "@/lib/api/itemsApi";
import { itemsColumn } from "./columns";

const AssetManagement = () => {
  const { data: items, isLoading: isItemsLoading } = useGetItemsQuery();

  return (
    <div className=" container mx-auto py-10">
      <h3 className=" text-lg font-bold leading-tight tracking-tight">
        Asset Management
      </h3>
      <DataTable data={items || []} columns={itemsColumn} />
    </div>
  );
};

export default AssetManagement;
