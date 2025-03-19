"use client";

import { useAuth } from "@/context/AuthContext";
import {
  useGetItemsByOwnerQuery,
  useGetItemsNotOwnedQuery,
} from "@/features/api/apiSlice";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { Employee, Item } from "@/types/global_types";
import DefaultButton from "../(component)/buttonDefault";
import { useRouter } from "next/navigation";
import { ArrowDropDownCircleSharp } from "@mui/icons-material";
import DataTable from "../(component)/datagrid";

//dropdown item to show
const ItemDropDown = ({
  itemShow,
  handleSelectItemShow,
  setOpenDropdownItem,
}: {
  itemShow: number;
  handleSelectItemShow: (param: number) => void;
  setOpenDropdownItem: (arg: boolean) => void;
}) => {
  const options = [
    { id: 1, label: "Owned Items" },
    { id: 2, label: "Not owned Items" },
  ];
  return (
    <div
      className="absolute z-50 left-16 -right-40 top-4 mt-2 bg-white border border-gray-300 rounded-md shadow-md w-44"
      onMouseLeave={() => setOpenDropdownItem(false)}
    >
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
    let items: Item[] = [];
    if (itemShow === 1 && ownedItems) {
      items = ownedItems;
    }
    if (itemShow === 2 && notOwnedItems) {
      items = notOwnedItems;
    }

    return items.map((item: Item) => {
      return {
        ...item,
        itemName: item?.itemDetails?.ITEM_NAME ?? "N/A",
        parNo: item.itemDetails?.PAR_NO ?? "N/A",
        mrNo: item.itemDetails?.MR_NO ?? "N/A",
        icsNo: item.itemDetails?.PIS_NO ?? "N/A",
        pisNo: item.itemDetails?.PIS_NO ?? "N/A",
        propNo: item.itemDetails?.PROP_NO ?? "N/A",
        serialNo: item.itemDetails?.SERIAL_NO ?? "N/A",
        receivedAt: item.itemDetails?.RECEIVED_AT ?? "N/A",
        accountableEmployee: `${item.accountableEmpDetails?.LASTNAME} ${
          item.accountableEmpDetails.FIRSTNAME
        } ${item.accountableEmpDetails.MIDDLENAME ?? ""} ${
          item.accountableEmpDetails.SUFFIX ?? ""
        }`,
        accountDetails: `${
          item?.itemDetails?.accountCodeDetails?.ACCOUNT_CODE ?? "N/A"
        } - ${item?.itemDetails?.accountCodeDetails?.ACCOUNT_TITLE ?? "N/A"}`,
      };
    });
  }, [ownedItems, itemShow, notOwnedItems]);

  const columns: GridColDef[] = [
    {
      field: "itemName",
      headerName: "Item",
      width: 180,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      renderCell: (params) =>
        `${params.row.quantity} / ${params.row.ORIGINAL_QUANTITY ?? "N/A"}`,
    },
    {
      field: "unit_value",
      headerName: "Unit value",
      type: "number",
      width: 120,
    },
    {
      field: "parNo",
      headerName: "PAR No",
      width: 120,
    },
    {
      field: "mrNo",
      headerName: "MR No",
      width: 120,
    },
    {
      field: "icsNo",
      headerName: "ICS No",
      width: 120,
    },
    {
      field: "pisNo",
      headerName: "PIS No",
      width: 120,
    },
    {
      field: "propNo",
      headerName: "PROP No",
      width: 120,
    },
    {
      field: "serialNo",
      headerName: "Serial No",
      width: 120,
    },
    {
      field: "accountDetails",
      headerName: "Account Details",
      width: 200,
    },

    {
      field: "total_value",
      headerName: "Total value",
      width: 120,
      type: "number",
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
      field: "accountableEmployee",
      headerName: "Accountable Employee",
      width: 300,
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex gap-1">
            <DefaultButton
              btnText="Lend"
              color="secondary"
              title="Lend this Item"
              disabled={itemShow === 2 || params.row.quantity <= 0}
              onClick={() => router.push(`/manager/lend/${params.row.id}`)}
            />
            <DefaultButton
              btnText="borrow"
              color="primary"
              disabled={itemShow === 1 || params.row.quantity <= 0}
              onClick={() => router.push(`/manager/borrow/${params.row.id}`)}
            />
            <DefaultButton
              btnText="transfer"
              color="warning"
              onClick={() => router.push(`/manager/transfer/${params.row.id}`)}
              disabled={params.row.quantity <= 0}
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

  //log owned items
  // useEffect(() => {
  //   if (itemToShow) {
  //     console.log(" items", itemToShow);
  //   }
  // }, [itemToShow]);

  console.log("items ", itemToShow);

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
            setOpenDropdownItem={setOpenDropdownItem}
          />
        )}
      </div>
      <DataTable
        sx={{ height: 400 }}
        rows={itemToShow || []}
        columns={columns}
        loading={isLoading || isNotOwnedItemLoading}
      />
    </>
  );
};

export default ManagerPage;
