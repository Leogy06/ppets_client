"use client";

import BackArrow from "@/app/(component)/backArrow";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetEmployeesQuery,
  useGetItemsByIdQuery,
} from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const LendItem = () => {
  const { itemId } = useParams();

  //get user emp details
  const { empDetails } = useAuth();

  //use get employees
  const { data: employees, isLoading: isEmpLoading } = useGetEmployeesQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  //use get item details
  const { data: itemDetails } = useGetItemsByIdQuery(Number(itemId));

  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Name", width: 200 },
  ];

  //   useEffect(() => {
  //     if (employees) {
  //       console.log("employees ", employees);
  //     }
  //   }, [employees]);

  useEffect(() => {
    if (itemDetails) {
      console.log("itemDetails ", itemDetails);
    }
  }, [itemDetails]);

  return (
    <div className="flex flex-col">
      <PageHeader pageHead="Select Employee to lend" />
      <div className="flex justify-between items-start mb-4">
        <BackArrow backTo="/manager" />
        {itemDetails && (
          <div className="flex flex-col items-end">
            <h2 className="font-semibold text-lg">Item Details</h2>
            <p>
              Name |{" "}
              <span className="font-medium text-base">
                {itemDetails.itemDetails.ITEM_NAME}
              </span>
            </p>
            <p>
              Quantity |{" "}
              <span className="font-medium text-base">
                <span className="text-green-700">{itemDetails.quantity}</span> /{" "}
                {itemDetails.ORIGINAL_QUANTITY}
              </span>
            </p>
            <p>
              Item name |{" "}
              <span className="font-medium text-base">
                {itemDetails.itemDetails.ITEM_NAME}
              </span>
            </p>
            <p>
              Item name |{" "}
              <span className="font-medium text-base">
                {itemDetails.itemDetails.ITEM_NAME}
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="h-[480px]">
        <DataGrid
          rows={employees?.map((emp) => ({
            ...emp,
            fullName: `${emp.LASTNAME}, ${emp.FIRSTNAME} ${
              emp.MIDDLENAME ?? ""
            } ${emp.SUFFIX ?? ""}`,
          }))}
          getRowId={(params) => params.ID}
          columns={columns}
          loading={isEmpLoading}
        />
      </div>
    </div>
  );
};

export default LendItem;
