"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import { useAuth } from "@/context/AuthContext";
import {
  useGetEmployeesQuery,
} from "@/features/api/apiSlice";
import { Employee } from "@/types/global_types";
import { DifferenceOutlined } from "@mui/icons-material";
import {  Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

const Distribution = () => {
  const router = useRouter();
  const { empDetails } = useAuth();
  const {
    data: employees,
    isLoading,
    isError,
  } = useGetEmployeesQuery(Number(empDetails?.CURRENT_DPT_ID));

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Full name",
      width: 280,
      renderCell: (params) =>
        `${params.row.LASTNAME} ${params.row.FIRSTNAME} ${
          params.row.MIDDLENAME || ""
        } ${params.row.SUFFIX || ""}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          <DefaultButton
            btnIcon={<DifferenceOutlined />}
            title="Distribute Item"
            placement="right"
            onClick={() => router.push(`/admin/distributions/${params.row.ID}`)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data...</div>;
  return (
    <>
      <Paper sx={{ height: 520 }}>
        <DataGrid
          getRowId={(params) => params.ID}
          columns={columns}
          rows={employees?.map((emp: Employee) => ({
            ...emp,
            fullName: `${emp.LASTNAME} ${emp.FIRSTNAME} ${emp.SUFFIX ?? ""} ${
              emp.MIDDLENAME ?? ""
            }`,
          }))}
        />
      </Paper>
    </>
  );
};

export default Distribution;
