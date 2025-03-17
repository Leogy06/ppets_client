"use client";

import BackArrow from "@/app/(component)/backArrow";
import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import {
  useGetEmployeeByIdQuery,
  useGetItemsByOwnerQuery,
} from "@/features/api/apiSlice";
import { Item } from "@/types/global_types";
import { PictureAsPdf } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const base_url = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

const DistributedItems = () => {
  const { emp_id } = useParams();

  //get employee details
  const { data: employee, isLoading: isEmployeeLoading } =
    useGetEmployeeByIdQuery(Number(emp_id));

  //get items accountabale person
  const { data: ownedItems, isLoading: isOwnedItemLoading } =
    useGetItemsByOwnerQuery(Number(emp_id));

  const handlePreviewPdf = async () => {
    try {
      const response = await axios.post(
        `${base_url}/api/pdfkit/owned-items`,
        { items: ownedItemsData },
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error in previewing pdf", error);
    }
  };

  //owned item columns
  const columns: GridColDef[] = [
    { field: "itemName", headerName: "Item Name", width: 200 },
    { field: "srnNo", headerName: "Serial No", width: 200 },
    { field: "pisNo", headerName: "Property Inventory Slip", width: 200 },
    { field: "propNo", headerName: "Property No", width: 200 },
    { field: "mrNo", headerName: "MR No", width: 200 },
    { field: "parNo", headerName: "PAR No", width: 200 },
    {
      field: "accountCode",
      headerName: "Account Code",
      width: 300,
    },
    {
      field: "unitValue",
      headerName: "Unit Value in ₱",
      width: 200,
      type: "number",
    },
    {
      field: "accountablePerson",
      headerName: "Accountable Person",
      width: 200,
    },
  ];

  const EmployeeDetails = () => {
    return (
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <h1>Employee Details </h1>
          <p>
            Name:{" "}
            <span className="underline underline-offset-1 font-medium">
              {`${employee?.FIRSTNAME} ${employee?.MIDDLENAME ?? ""} ${
                employee?.LASTNAME
              } ${employee?.SUFFIX ?? ""}`}
            </span>
          </p>
          <p>
            Department:{" "}
            <span className="underline underline-offset-1 font-medium">
              {employee?.departmentDetails?.DEPARTMENT_NAME ?? "N/A"}
            </span>
          </p>
        </div>
        <Tooltip
          title={<span className="text-base">Download PDF</span>}
          arrow
          placement="left"
        >
          <button onClick={handlePreviewPdf}>
            <PictureAsPdf />
          </button>
        </Tooltip>
      </div>
    );
  };

  // console.log("employee", employee);
  // useEffect(() => {
  //   console.log("employee", employee);
  // }, [employee]);

  // console.log("ownedItems", ownedItems);
  useEffect(() => {
    console.log("ownedItems", ownedItems);
  }, [ownedItems]);

  const ownedItemsData = useMemo(() => {
    return ownedItems?.map((item: Item) => {
      return {
        ...item,
        itemName: item.itemDetails.ITEM_NAME,
        serialNo: item.itemDetails.SERIAL_NO,
        parNo: item.itemDetails.PAR_NO,
        icsNo: item.itemDetails.ICS_NO,
        pisNo: item.itemDetails.PIS_NO,
        propNo: item.itemDetails.PROP_NO,
        srnNo: item.itemDetails.SERIAL_NO,
        mrNo: item.itemDetails.MR_NO,
        unitValue: item.itemDetails.UNIT_VALUE,
        accountablePerson: `${item.accountableEmpDetails.LASTNAME}, ${
          item.accountableEmpDetails.FIRSTNAME
        } ${item.accountableEmpDetails?.MIDDLENAME ?? ""} ${
          item.accountableEmpDetails?.SUFFIX ?? ""
        }`,
        accountCode: `${
          item.itemDetails?.accountCodeDetails?.ACCOUNT_CODE ?? ""
        } - ${item.itemDetails?.accountCodeDetails?.ACCOUNT_TITLE ?? ""}`,
      };
    });
  }, [ownedItems]);

  // if (isEmployeeLoading) {
  //   return <p>Loading...</p>;
  // }
  return (
    <>
      <PageHeader pageHead="Distributed Items" />
      <div className="mb-2">
        <BackArrow backTo="/admin/distributions" />
      </div>
      <EmployeeDetails />
      <DataTable
        loading={isOwnedItemLoading || isEmployeeLoading}
        rows={ownedItemsData || []}
        columns={columns}
      />
    </>
  );
};

export default DistributedItems;
