"use client";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const Employee = () => {
  const columns: GridColDef[] = [
    { field: "ID", headerName: "ID" },
    { field: "FIRSTNAME", headerName: "Name", width: 150 },
    { field: "LASTNAME", headerName: "Email", width: 200 },
    { field: "DEPARTMENT_ID", headerName: "Department", width: 150 },
  ];

  const [employees, setemployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/employees");
        const data = await response.json();

        setemployees(data.employee);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid rows={employees} columns={columns} />
      </Paper>
    </>
  );
};

export default Employee;
