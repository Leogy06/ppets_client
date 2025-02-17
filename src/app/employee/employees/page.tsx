"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetEmployeesQuery } from "@/features/api/apiSlice";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

//para kung kinsa pahulman ug item

const Employee = () => {
  const router = useRouter();
  const { empDetails } = useAuth();
  const { data: employees, isLoading: isEmpLdng } = useGetEmployeesQuery(
    empDetails?.CURRENT_DPT_ID as number
  );

  const columns: GridColDef[] = [
    { field: "LASTNAME", headerName: "Lastname", width: 180 },
    { field: "FIRSTNAME", headerName: "Firstname", width: 180 },
    {
      field: "MIDDLENAME",
      headerName: "Middlename",
      width: 70,
      valueGetter: (params) => (params ? params : "--"),
    },
    {
      field: "SUFFIX",
      headerName: "Suffix",
      width: 70,
      valueGetter: (params) => (params ? params : "--"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      renderCell: (params) => {
        return (
          <DefaultButton
            btnText="lend"
            onClick={() => router.push(`/employee/employees/${params.row.ID}`)}
          />
        );
      },
    },
  ];

  return (
    <>
      <PageHeader pageHead="Employees" />
      <Paper sx={{ height: 580 }}>
        <DataGrid
          getRowId={(params) => params.ID}
          rows={employees}
          columns={columns}
          loading={isEmpLdng}
        />
      </Paper>
    </>
  );
};

export default Employee;
