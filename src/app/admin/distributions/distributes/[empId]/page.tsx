"use client";

import BackArrow from "@/app/(component)/backArrow";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetEmployeeByIdQuery,
  useGetItemsDepartmentQuery,
} from "@/features/api/apiSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React from "react";

const MultipleDistributes = () => {
  //use hooks
  const { empId } = useParams();
  const { empDetails } = useAuth();
  const { data: items, isLoading: isItmLdng } = useGetItemsDepartmentQuery(
    empDetails?.CURRENT_DPT_ID ?? 0
  );

  //find employe by id;

  const { data: employeeDetails } = useGetEmployeeByIdQuery(Number(empId));

  //others
  const columns: GridColDef[] = [
    { field: "name", headerName: "Item name", width: 130 },
    { field: "description", headerName: "Description", width: 170 },
    { field: "quantity", headerName: "Quantity", width: 70 },

    { field: "unit_value", headerName: "Unit value", width: 120 },
    { field: "total_value", headerName: "Total Value", width: 120 },
    {
      field: "ics",
      headerName: "ICS #",
      width: 120,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "are_no",
      headerName: "ARE #",
      width: 170,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "prop_no",
      headerName: "PROP #",
      width: 170,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "serial_no",
      headerName: "SERIAL #",
      width: 170,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "pis_no",
      headerName: "PIS #",
      width: 170,
      valueGetter: (params) => params ?? "--",
    },
    {
      field: "createdAt",
      headerName: "Added on",
      width: 170,
      type: "dateTime",
      valueGetter: (params) => new Date(params) ?? "--",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 180,
      valueGetter: (params) => params ?? "--",
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader pageHead="Select Item(s)" />
      <div className="mb-4 flex justify-between items-start">
        <BackArrow backTo="/admin/distributions" />
        <div>
          {employeeDetails ? (
            <div className="flex flex-col text-base">
              <span className="font-semibold">Given to:</span>
              {`${employeeDetails.LASTNAME} ${employeeDetails.FIRSTNAME} ${
                employeeDetails.SUFFIX ?? ""
              } ${employeeDetails.MIDDLENAME ?? ""}`}
            </div>
          ) : (
            "No employee found."
          )}
        </div>
      </div>
      <DataGrid
        columns={columns}
        rows={items?.filter((itm) => itm.OWNER_EMP === null)}
        checkboxSelection
      />
    </div>
  );
};

export default MultipleDistributes;
