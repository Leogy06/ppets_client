"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useGetEmployeesQuery } from "@/features/api/apiSlice";
import { Employee } from "@/types/global_types";
import { mapEmployees } from "@/utils/arrayUtils";
import {
  AccountTreeOutlined,
  DifferenceOutlined,
  List,
} from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Distribution = () => {
  const router = useRouter();
  const { empDetails } = useAuth();
  //row limt
  const [rowLimit, setRowLimit] = useState(10);
  const { data: employees, isLoading } = useGetEmployeesQuery({
    departmentId: empDetails?.CURRENT_DPT_ID,
    limit: rowLimit,
  });
  //map employee
  const mappedEmployees = useMemo(() => mapEmployees(employees), [employees]);

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 50,
      headerAlign: "center",
      align: "center",
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
      <div className="flex gap-2 items-center mb-4">
        <PageHeader
          pageHead="Distribution"
          icon={AccountTreeOutlined}
          hasMarginBottom={false}
        />
        <OptionRowLimitCount
          onChange={setRowLimit}
          currentValue={rowLimit}
          className="bg-white"
        />
      </div>
      <DataTable
        loading={isLoading}
        getRowId={(params) => params.ID}
        disableRowSelectionOnClick
        columns={columns}
        rows={mappedEmployees}
      />
    </>
  );
};

export default Distribution;
