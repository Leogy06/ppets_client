"use client";

import BackArrow from "@/app/(component)/backArrow";
import DataTable from "@/app/(component)/datagrid";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetItemsDepartmentQuery } from "@/features/api/apiSlice";
import { UndistributedItem } from "@/types/global_types";
import { PictureAsPdf } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect } from "react";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

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

  //render items pdf
  const handlePDFPreview = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/api/pdfkit/item`,
        { items: distributedItems },
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      //crete blob pdf response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfURL = URL.createObjectURL(blob);

      window.open(pdfURL, "_blank");
    } catch (error) {
      console.error("Failed to preview PDF. ", error);
    }
  };

  useEffect(() => {
    if (distributedItems) {
      console.log("distributed items ", distributedItems);
    }
  }, [distributedItems]);

  return (
    <>
      <PageHeader pageHead="Distributed Items" />
      <div className="mb-4 flex justify-between items-start">
        <BackArrow backTo="/admin/distributions" />
        <Tooltip
          title={<span className="text-base font-medium">Preview PDF</span>}
          placement="left"
        >
          <button onClick={handlePDFPreview}>
            <PictureAsPdf />
          </button>
        </Tooltip>
      </div>
      <DataTable
        loading={isItemsLoading}
        columns={columns}
        disableRowSelectionOnClick
        rows={
          distributedItems?.map((item) => ({
            ...item,
            accountableEmpDetails: `${item.accountableEmpDetails.FIRSTNAME.toUpperCase()} ${item.accountableEmpDetails.LASTNAME.toUpperCase()} ${
              item.accountableEmpDetails?.MIDDLENAME?.toUpperCase() ?? ""
            } ${item.accountableEmpDetails?.SUFFIX?.toUpperCase() ?? ""}`,
          })) || []
        }
      />
    </>
  );
};

export default DistributedItems;
