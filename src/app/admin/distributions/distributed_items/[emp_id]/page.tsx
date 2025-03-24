"use client";

import BackArrow from "@/app/(component)/backArrow";
import DataTable from "@/app/(component)/datagrid";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetDistributedItemsQuery,
  useGetEmployeeByIdQuery,
  useGetUndistributedItemCountQuery,
} from "@/features/api/apiSlice";
import { mapDistributedItems } from "@/utils/arrayUtils";
import { PictureAsPdf } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const base_url = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

const DistributedItems = () => {
  const { emp_id } = useParams();
  //use employee details
  const { empDetails } = useAuth();

  //employee row limit
  const [rowLimit, setRowLimit] = useState(10);

  //get employee details
  const { data: employee, isLoading: isEmployeeLoading } =
    useGetEmployeeByIdQuery(Number(emp_id));

  //get items accountabale person
  debugger;
  const { data: ownedItems, isLoading: isOwnedItemLoading } =
    useGetDistributedItemsQuery({
      owner_emp_id: Number(emp_id),
      limit: rowLimit,
      department: Number(employee?.CURRENT_DPT_ID),
    });
  debugger;
  //get distribbuted items count
  const { data: unDistributedItemsCount } = useGetUndistributedItemCountQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

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

  //maped own items
  const ownedItemsData = useMemo(() => {
    return mapDistributedItems(ownedItems?.ownedItems);
  }, [ownedItems]);

  //owned item columns
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
    },

    { field: "itemName", headerName: "Item Name", width: 200 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center">
          {params.row.quantity}/{params.row.originalQuantity}
        </div>
      ),
    },
    { field: "itemPar", headerName: "PAR #", width: 200 },
    { field: "itemMr", headerName: "MR #", width: 200 },
    {
      field: "accountableEmp",
      headerName: "Accountable Employee",
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
  // useEffect(() => {
  //   console.log("ownedItems", ownedItems);
  // }, [ownedItems]);

  // if (isEmployeeLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      <div className="mb-2 flex gap-1 items-center">
        <BackArrow backTo="/admin/distributions" />
        <PageHeader pageHead="Distributed Items" hasMarginBottom={false} />
        <OptionRowLimitCount
          onChange={(limit) => setRowLimit(limit)}
          currentValue={rowLimit}
          totalCount={unDistributedItemsCount}
          className="bg-white"
        />
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
