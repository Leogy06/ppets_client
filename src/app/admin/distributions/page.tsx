"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
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
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

const Distribution = () => {
  const router = useRouter();
  const { empDetails } = useAuth();
  const { data: employees, isLoading } = useGetEmployeesQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,

      renderCell: (params) => (
        <div className="flex gap-2 justify-center items-center">
          <DefaultButton
            btnIcon={<DifferenceOutlined />}
            title="Distribute Item"
            placement="bottom"
            onClick={() => router.push(`/admin/distributions/${params.row.ID}`)}
          />
          <DefaultButton
            btnIcon={<List />}
            title="View Distributed Items"
            placement="bottom"
            onClick={() =>
              router.push(
                `/admin/distributions/distributed_items/${params.row.ID}`
              )
            }
          />
        </div>
      ),
    },
    {
      field: "fullName",
      headerName: "Full name",
      width: 280,
      flex: 1,
      renderCell: (params) => (
        <span className="font-bold">
          {`${params.row.LASTNAME} ${params.row.FIRSTNAME} ${
            params.row.MIDDLENAME || ""
          } ${params.row.SUFFIX || ""}`}
        </span>
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
      <DataTable
        loading={isLoading}
        getRowId={(params) => params.ID}
        disableRowSelectionOnClick
        columns={columns}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            background: "#4169e1", // Change this to your desired color
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#375ba5", // **Cell color inside headers**
            color: "white", // Text color for better contrast
            // Optional: add borders between header cells
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Make header text bold
            textTransform: "uppercase",
          },
        }}
        rows={
          employees?.map((emp: Employee) => ({
            ...emp,
            fullName: `${emp.LASTNAME} ${emp.FIRSTNAME} ${emp.SUFFIX ?? ""} ${
              emp.MIDDLENAME ?? ""
            }`,
          })) ?? []
        }
      />
    </>
  );
};

export default Distribution;
