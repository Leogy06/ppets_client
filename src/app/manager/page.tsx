"use client";
import React, { useMemo, useState } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetDistributedItemsQuery } from "@/features/api/apiSlice";
import DataTable from "../(component)/datagrid";
import { GridColDef } from "@mui/x-data-grid";
import { mapDistributedItems } from "@/utils/arrayUtils";
import DefaultButton from "../(component)/buttonDefault";
import { useRouter } from "next/navigation";
import OptionRowLimitCount from "../(component)/optionRowLimit";

const OwnedItems = () => {
  const { empDetails } = useAuth();

  //nav router
  const router = useRouter();

  //table row limit
  const [rowLimit, setRowLimit] = useState(10);

  //get owned items
  const { data: distributeItems, isLoading: isOwnedItemsLoading } =
    useGetDistributedItemsQuery({
      department: Number(empDetails?.CURRENT_DPT_ID),
      limit: rowLimit,
      owner_emp_id: Number(empDetails?.ID),
    });

  const mappedOwnedItems = useMemo(
    () => mapDistributedItems(distributeItems?.ownedItems || []),
    [distributeItems]
  );

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "itemName",
      headerName: "Item Name",
      width: 300,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      headerAlign: "center",
      type: "number",
      renderCell: (params) => {
        return (
          <div className="flex justify-center">
            {params.row.quantity}/{params.row.originalQuantity}
          </div>
        );
      },
    },
    {
      field: "accountableEmp",
      headerName: "Owner",
      width: 300,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex gap-2 justify-center">
            <DefaultButton
              btnText="lend"
              onClick={() =>
                router.push(`/manager/request/lend/${params.row.id}`)
              }
              disabled={params.row.quantity === 0}
            />
            <DefaultButton
              btnText="transfer"
              color="secondary"
              onClick={() =>
                router.push(`/manager/request/transfer/${params.row.id}`)
              }
              disabled={params.row.quantity === 0}
            />
          </div>
        );
      },
    },
  ];

  // useEffect(() => {
  //   if (ownedItems) {
  //     console.log("ownedItems ", ownedItems);
  //   }
  // }, [ownedItems]);

  return (
    <>
      <div className="flex gap-2 mb-4">
        <PageHeader pageHead="Owned Items" hasMarginBottom={false} />
        <OptionRowLimitCount
          currentValue={rowLimit}
          onChange={setRowLimit}
          className="bg-white"
        />
      </div>
      <DataTable
        columns={columns}
        rows={mappedOwnedItems || []}
        loading={isOwnedItemsLoading}
      />
    </>
  );
};

export default OwnedItems;
