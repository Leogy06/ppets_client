"use client";
import {
  EmployeeProps,
  useEditEmployeeMutation,
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

  //edit employee
  const [editEmployee] = useEditEmployeeMutation();

  const columns: GridColDef[] = [
    { field: "ID_NUMBER", headerName: "ID number", width: 150, editable: true },
    { field: "LASTNAME", headerName: "Last Name", width: 150, editable: true },
    {
      field: "FIRSTNAME",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    {
      field: "MIDDLENAME",
      headerName: "Middle Name",
      width: 150,
      editable: true,
    },
    { field: "SUFFIX", headerName: "Suffix", width: 100, editable: true },
    { field: "CURRENT_DEPARTMENT" },
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

  //handle row edit
  const handleRowEdit = async (newRow: any) => {
    console.log("New Row: ", newRow);

    const { ID, ...updatedFields } = newRow;
    try {
      await editEmployee({ data: updatedFields, id: ID });

      return { ...newRow };
    } catch (error) {
      console.error(error);
      return { ...employees?.find((row) => row.ID === ID) };
    }
  };

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
        <DataGrid
          rows={employees}
          columns={columns}
          processRowUpdate={handleRowEdit}
        />
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
