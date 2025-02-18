"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetDepartmentQuery,
  useGetItemsDepartmentQuery,
} from "@/features/api/apiSlice";
import { Employee } from "@/types/global_types";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RequestItem = () => {
  const router = useRouter();
  const { empDetails } = useAuth();
  const { data: departments, isLoading: isDptLdng } = useGetDepartmentQuery();

  //department filter
  const [departmentFilter, setDepartmentFilter] = useState<number>(
    empDetails?.CURRENT_DPT_ID as number
  );

  //items
  const { data: items = [], isLoading: isItemLdng } =
    useGetItemsDepartmentQuery(departmentFilter, {
      skip: departmentFilter === null,
      refetchOnMountOrArgChange: true,
    });

  const columns: GridColDef[] = [
    { field: "name", headerName: "Item Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 70 },
    { field: "accountable_emp", headerName: "Custodian", width: 190 },
    {
      field: "itemCustodian",
      headerName: "Custodian",
      width: 200,
      valueGetter: (params: Employee) => {
        return `${params.LASTNAME ?? "Unknow"}, ${
          params.FIRSTNAME ?? "Unknown"
        } ${params.MIDDLENAME ?? ""} ${params.SUFFIX ?? ""}`;
      },
    },
    {
      field: "actions",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <DefaultButton
            btnText="request"
            onClick={() =>
              router.push(`/employee/request_item/${params.row.id}`)
            }
          />
        );
      },
    },
  ];

  return (
    <>
      <PageHeader pageHead="Request Item" />
      <div className="flex justify-end mb-4">
        <Autocomplete
          className="w-full md:w-1/2"
          options={departments || []}
          loading={isDptLdng}
          getOptionLabel={(option) => option.DESCRIPTION || ""}
          value={departments?.find((d) => d.ID === departmentFilter) || null}
          onChange={(_, newValue) => {
            if (newValue) {
              setDepartmentFilter(newValue.ID);
            }
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Select Department"
                variant="outlined"
              />
            );
          }}
        />
      </div>
      <DataGrid
        rows={items}
        columns={columns}
        loading={isItemLdng}
        sx={{ height: 400 }}
      />
    </>
  );
};

export default RequestItem;
