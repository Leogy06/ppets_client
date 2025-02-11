"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import {
  useGetDepartmentQuery,
  useGetEmployeesQuery,
} from "@/features/api/apiSlice";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Distribution = () => {
  const router = useRouter();
  const [department, setDepartment] = useState(1);
  const {
    data: employees,
    isLoading,
    isError,
  } = useGetEmployeesQuery(department);

  const { data: departments } = useGetDepartmentQuery();

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
      field: "CURRENT_DPT_ID",
      headerName: "Department",
      width: 300,
      valueGetter: (params) =>
        departments?.find((department) => department.ID === params)
          ?.DEPARTMENT_NAME || "Unknown Department",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-2">
          <DefaultButton
            btnText="Distribute item"
            color="secondary"
            onClick={() =>
              router.push(`/admin/distributions/distribute/${params.id}`)
            }
          />
          <DefaultButton btnText="Multiple item distribution" />
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data...</div>;
  return (
    <>
      <Autocomplete
        className="w-full md:w-96 mb-4"
        options={departments || []}
        getOptionLabel={(option) => option.DEPARTMENT_NAME || ""}
        value={departments?.find((d) => d.ID === department || null)}
        onChange={(_, newValue) => {
          if (newValue) {
            setDepartment(newValue.ID);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select Department" variant="outlined" />
        )}
      />
      <Paper sx={{ height: 520 }}>
        <DataGrid
          getRowId={(params) => params.ID}
          columns={columns}
          rows={employees}
        />
      </Paper>
    </>
  );
};

export default Distribution;
