"use client";
import {
  EmployeeProps,
  useGetDepartmentQuery,
  useGetEmployeesQuery,
} from "@/state/api";
import { dateFormmater } from "@/utils/date_formmater";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import StoreProvider, { useAppSelector } from "../redux";
import { useRouter } from "next/navigation";

const Employee = () => {
  //department filter
  const [departmentID, setDepartmentID] = useState(1);

  //get employees

  const {
    data: employees,
    isLoading: isEmployeeRdy,
    isError: isEmployeeErr,
  } = useGetEmployeesQuery(departmentID);

  //get department
  const {
    data: departments,
    isLoading: isDptRdy,
    isError: isDptErr,
  } = useGetDepartmentQuery();

  const columns: GridColDef[] = [
    { field: "LASTNAME", headerName: "Last Name", width: 150 },
    {
      field: "FIRSTNAME",
      headerName: "First Name",
      width: 150,
    },
    { field: "MIDDLENAME", headerName: "Middle Name", width: 150 },
    { field: "SUFFIX", headerName: "Suffix", width: 100 },
    { field: "CREATED_BY", headerName: "Added by", width: 150 },
    {
      field: "CREATED_WHEN",
      headerName: "Created When",
      width: 200,
      type: "date",
      valueFormatter: (param) => dateFormmater(param as string),
    },
    { field: "UPDATED_BY", headerName: "Updated By", width: 150 },
    {
      field: "UPDATED_WHEN",
      headerName: "Updated When",
      width: 200,
      type: "date",
      valueFormatter: (param) => dateFormmater(param as string),
    },
  ];

  //router
  const router = useRouter();

  if (isEmployeeRdy) {
    return <p className="animate-pulse">Loading...</p>;
  }

  if (isEmployeeErr) {
    return <p className="text-red-500">Error loading data...</p>;
  }
  return (
    <>
      <div className=" flex justify-end mb-4">
        {isDptRdy ? (
          <span className="animate-pulse text-gray-300">
            Loading department options...
          </span>
        ) : (
          <Autocomplete
            className="w-full md:w-96"
            options={departments || []}
            getOptionLabel={(option) => option.DEPARTMENT_NAME || ""}
            value={departments?.find((d) => d.ID === departmentID) || null}
            onChange={(_, newValue) => {
              if (newValue) {
                setDepartmentID(newValue.ID);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Department ID" variant="outlined" />
            )}
            loading={isDptRdy}
            loadingText={<CircularProgress size={20} />}
          />
        )}
      </div>
      <Paper sx={{ height: 400, width: "100%", marginBottom: "1rem" }}>
        <DataGrid rows={employees} columns={columns} />
      </Paper>
      <div className="flex justify-end">
        <Button
          variant="contained"
          onClick={() => router.push("/employee/add_employee")}
        >
          add employee
        </Button>
      </div>
    </>
  );
};

export default Employee;
