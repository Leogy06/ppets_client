"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetEmployeesQuery } from "@/features/api/apiSlice";
import { DifferenceOutlined } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

const LendItem = () => {
  const { empDetails } = useAuth();
  const router = useRouter();
  const { data: employees, isLoading } = useGetEmployeesQuery(
    empDetails?.CURRENT_DPT_ID as number
  );

  const columns: GridColDef[] = [
    { field: "LASTNAME", headerName: "Last Name", width: 180 },
    { field: "FIRSTNAME", headerName: "First Name", width: 180 },
    {
      field: "MIDDLENAME",
      headerName: "Middle Name",
      width: 75,
      valueGetter: (params) => params || "",
    },
    { field: "SUFFIX", headerName: "Suffix", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <DefaultButton
          btnIcon={<DifferenceOutlined />}
          title="Lend Items"
          onClick={() => router.push(`/manager/lend_items/${params.row.ID}`)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader pageHead="Lend Items" />
      <Paper sx={{ height: 400 }}>
        <DataGrid
          columns={columns}
          rows={employees}
          getRowId={(row) => row.ID}
          loading={isLoading}
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
        />
      </Paper>
    </>
  );
};

export default LendItem;
