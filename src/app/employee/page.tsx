"use client";
import { useGetEmployeesQuery } from "@/state/api";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const Employee = () => {
  const {
    data: employees,
    isLoading: isEmployeeRdy,
    isError: isEmployeeErr,
  } = useGetEmployeesQuery();

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ID", width: 90 },
    { field: "ID_NUMBER", headerName: "ID Number", width: 150 },
    { field: "FIRSTNAME", headerName: "First Name", width: 150 },
    { field: "MIDDLENAME", headerName: "Middle Name", width: 150 },
    { field: "LASTNAME", headerName: "Last Name", width: 150 },
    { field: "SUFFIX", headerName: "Suffix", width: 100 },
    { field: "DEPARTMENT_ID", headerName: "Department ID", width: 150 },
    {
      field: "DETAILED_DEPARTMENT_ID",
      headerName: "Detailed Department ID",
      width: 200,
    },
    { field: "CREATED_BY", headerName: "Created By", width: 150 },
    {
      field: "CREATED_WHEN",
      headerName: "Created When",
      width: 200,
      type: "dateTime",
    },
    { field: "UPDATED_BY", headerName: "Updated By", width: 150 },
    {
      field: "UPDATED_WHEN",
      headerName: "Updated When",
      width: 200,
      type: "dateTime",
    },
    { field: "DELETED", headerName: "Deleted", width: 100 },
  ];

  return (
    <>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid rows={employees} columns={columns} />
      </Paper>
    </>
  );
};

export default Employee;
