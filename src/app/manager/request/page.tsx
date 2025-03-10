"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import {
  useGetBorrowingTransactionByBorrowerQuery,
  useGetBorrowingTransactionByOwnerQuery,
} from "@/features/api/apiSlice";
import {
  Employee,
  StatusProcess,
  UndistributedItem,
} from "@/types/global_types";
import { ArrowDropDownCircle } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";

const RequestDropDown = ({
  requestShow,
  handleRequestToShow,
}: {
  requestShow: number;
  handleRequestToShow: (param: number) => void;
}) => {
  const options = [
    { id: 1, label: "See who request your item(s)" },
    { id: 2, label: "See item(s) you requested." },
  ];
  return (
    <div
      className={`absolute rounded-lg z-50 top-8 left-0 w-44 bg-white border border-gray-300`}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleRequestToShow(option.id)}
          className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 ${
            requestShow === option.id ? "bg-gray-200" : "bg-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const RequestItem = () => {
  //use auth
  const { empDetails } = useAuth();

  //use get requests related to this user
  const { data: itemRequests, isLoading: itemRequestsLoading } =
    useGetBorrowingTransactionByOwnerQuery(empDetails?.ID);

  //use get requests by this user they want to borrow

  const { data: itemRequestsBorrow, isLoading: isRequestBorrowLoading } =
    useGetBorrowingTransactionByBorrowerQuery({
      empId: empDetails?.ID,
    });

  //request drop down
  const [openRequestDropdown, setOpenRequestDropdown] = useState(false);

  //show rows of request
  const [requestShow, setRequestShow] = useState(1);

  const handleToggleRequestDropdown = () => {
    setOpenRequestDropdown((prevState) => !prevState);
  };

  //handle request to show
  const handleRequestToShow = (itemShownumber: number) => {
    setRequestShow(itemShownumber);
  };

  //column grid
  const column: GridColDef[] = [
    {
      field: "itemDetails",
      headerName: "Requesting Item",
      valueGetter: (params: UndistributedItem) => params.ITEM_NAME,
      width: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 90,
    },
    {
      field: "statusDetails",
      headerName: "Status",
      valueGetter: (params: StatusProcess) => params.description.toUpperCase(),
    },
    {
      field: "approvedByEmpDetails",
      headerName: "Approved by",
      width: 220,
      valueGetter: (params: Employee) =>
        params
          ? `${params.LASTNAME} ${params.FIRSTNAME} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "--",
    },
    {
      field: "ownerEmp",
      headerName: "Owner",
      width: 220,
      valueGetter: (params: Employee) =>
        params
          ? `${params.LASTNAME} ${params.FIRSTNAME} ${
              params.MIDDLENAME ?? ""
            } ${params.SUFFIX ?? ""}`
          : "--",
    },
    {
      field: "createdAt",
      headerName: "Requested at",
      width: 200,
      type: "dateTime",
      valueGetter: (params) => new Date(params),
    },
    {
      field: "borrowerEmp",
      headerName: "Borrower",
      width: 220,
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
    },
  ];

  useEffect(() => {
    if (itemRequests) {
      console.log("Requests ", itemRequests);
    }
  }, [itemRequests]);

  useEffect(() => {
    if (itemRequestsBorrow) {
      console.log("borrow request ", itemRequestsBorrow);
    }
  }, [itemRequestsBorrow]);

  //row request to show
  const requestRowsToShow = useMemo(() => {
    if (requestShow === 1) {
      return itemRequests;
    }
    if (requestShow === 2) {
      return itemRequestsBorrow;
    }
  }, [itemRequests, itemRequestsBorrow, requestShow]);

  return (
    <>
      <div className="flex gap-1 items-start relative">
        <PageHeader pageHead="Request Item" />
        <button onClick={handleToggleRequestDropdown}>
          <ArrowDropDownCircle />
        </button>
        {openRequestDropdown && (
          <RequestDropDown
            requestShow={requestShow}
            handleRequestToShow={handleRequestToShow}
          />
        )}
      </div>
      <DataGrid
        sx={{ height: 400 }}
        rows={requestRowsToShow}
        columns={column}
        loading={itemRequestsLoading || isRequestBorrowLoading}
      />
    </>
  );
};

export default RequestItem;
