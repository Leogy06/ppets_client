"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetEmployeesQuery } from "@/features/api/apiSlice";
import { Employee } from "@/types/global_types";
import {
  AccountTreeOutlined,
  DifferenceOutlined,
  List,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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

  //console log employees
  // useEffect(() => {
  //   if (employees) {
  //     console.log("Employees ", employees);
  //   }
  // }, [employees]);

  //console log dpt id
  // useEffect(() => {
  //   if (empDetails) {
  //     console.log("DPT id ", empDetails?.CURRENT_DPT_ID);
  //   }
  // }, [empDetails]);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data...</div>;
  return (
    <>
      <div className="flex justify-between items-start">
        <PageHeader pageHead="Distribution" icon={AccountTreeOutlined} />
        <Tooltip
          title={<span className="text-base">See Distributed Items</span>}
        >
          <button
            className="hover:text-gray-500"
            onClick={() => router.push("/admin/distributions/items")}
          >
            <List />
          </button>
        </Tooltip>
      </div>
      <DataGrid
        getRowId={(params) => params.ID}
        sx={{ height: 400 }}
        columns={columns}
        rows={employees?.map((emp: Employee) => ({
          ...emp,
          fullName: `${emp.LASTNAME} ${emp.FIRSTNAME} ${emp.SUFFIX ?? ""} ${
            emp.MIDDLENAME ?? ""
          }`,
        }))}
      />
    </>
  );
};

export default Distribution;
