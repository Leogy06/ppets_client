"use client";

import { useAuth } from "@/context/AuthContext";
import {
  useGetItemsByOwnerQuery,
  useGetItemsNotOwnedQuery,
} from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { Employee, UndistributedItem } from "@/types/global_types";
import DefaultButton from "../(component)/buttonDefault";
import { useRouter } from "next/navigation";
import { ArrowDropDownCircleSharp } from "@mui/icons-material";

//dropdown item to show
const ItemDropDown = ({
  itemShow,
  handleSelectItemShow,
}: {
  itemShow: number;
  handleSelectItemShow: (param: number) => void;
}) => {
  const options = [
    { id: 1, label: "Owned Items" },
    { id: 2, label: "Not owned Items" },
  ];
  return (
    <div className="absolute z-50 left-16 -right-40 top-4 mt-2 bg-white border border-gray-300 rounded-md shadow-md w-44">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelectItemShow(option.id)}
          className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 ${
            itemShow === option.id ? "bg-gray-200" : "bg-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const ManagerPage = () => {
  const { user, empDetails } = useAuth();

  const {
    data: ownedItems,
    isLoading,
    isError,
  } = useGetItemsByOwnerQuery(user?.emp_id);

  const { data: notOwnedItems, isLoading: isNotOwnedItemLoading } =
    useGetItemsNotOwnedQuery({
      empId: user?.emp_id,
      departmentId: empDetails?.CURRENT_DPT_ID,
    });

  // use router
  const router = useRouter();

  //use states
  //which item, 1: owned items 2: unowned items
  const [itemShow, setItemShow] = useState(1);

  const [openDropdownItem, setOpenDropdownItem] = useState(false);

  const itemToShow = useMemo(() => {
    if (itemShow === 1 && notOwnedItems) {
      return ownedItems;
    }
    if (itemShow === 2 && notOwnedItems) {
      return notOwnedItems;
    }
  }, [ownedItems, itemShow, notOwnedItems]);

  const columns: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Item",
      valueGetter: (params: UndistributedItem) =>
        params ? params.ITEM_NAME : "--",
      width: 180,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      renderCell: (params) =>
        `${params.row.quantity} / ${
          params.row.ORIGINAL_QUANTITY ?? " Unknown"
        }`,
    },
    {
      field: "unit_value",
      headerName: "Unit value",
      type: "number",
      width: 78,
    },
    {
      field: "total_value",
      headerName: "Total value",
      width: 90,
    },
    {
      field: "DISTRIBUTED_ON",
      headerName: "Distrbuted on",
      width: 220,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : "--"),
    },
    {
      field: "distributedByEmpDetails",
      headerName: "Approved by",
      width: 200,
      valueGetter: (params: Employee) =>
        params
          ? `${params.LASTNAME} ${params.FIRSTNAME} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "--",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <DefaultButton
              btnText="Lend"
              color="secondary"
              title="Lend this Item"
              onClick={() => router.push(`/manager/lend/${params.row.id}`)}
            />
          </div>
        );
      },
    },
  ];

  const handleSelectionDropdown = () => {
    setOpenDropdownItem((prevState) => !prevState);
  };

  const handleSelectItemShow = (itemShowOption: number) => {
    setItemShow(itemShowOption);
  };

  // useEffect(() => {
  //   if (notOwnedItems) {
  //     console.log("not owned items ", notOwnedItems);
  //   }
  // }, [notOwnedItems]);

  if (isError) {
    return <div className="text-red-500 ">Error fetching items...</div>;
  }

  return (
    <>
      <div className="flex gap-2 items-start relative">
        <PageHeader pageHead="Items" />
        <button onClick={handleSelectionDropdown}>
          <ArrowDropDownCircleSharp />
        </button>
        {openDropdownItem && (
          <ItemDropDown
            itemShow={itemShow}
            handleSelectItemShow={handleSelectItemShow}
          />
        )}
      </div>
      <DataGrid
        sx={{ height: 400 }}
        rows={itemToShow}
        columns={columns}
        loading={isLoading || isNotOwnedItemLoading}
      />
    </>
  );
};

export default ManagerPage;
