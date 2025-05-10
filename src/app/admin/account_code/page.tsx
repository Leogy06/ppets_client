"use client";

import DataTable from "@/app/(component)/datagrid";
import FloatingAdd from "@/app/(component)/FloatingAdd";
import PageHeader from "@/app/(component)/pageheader";
import { useGetAccountItemQuery } from "@/features/api/apiSlice";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AccountCode = () => {
  // * use router
  const router = useRouter();
  const { data: accountCodesData, isLoading: isAccountCodeLoading } =
    useGetAccountItemQuery();

  //table columns
  const columns: GridColDef[] = [{ field: "ID", headerName: "ID", width: 100 }];

  //prefetch add account code
  useEffect(() => {
    router.prefetch("/admin/account_code/add");
  }, [router]);

  return (
    <>
      <PageHeader pageHead="Manage Account Code" />
      <DataTable
        rows={accountCodesData || []}
        loading={isAccountCodeLoading}
        columns={columns}
        getRowId={(params) => params.ID}
      />
      <FloatingAdd
        toolTipTitle="Add Account Code"
        onClick={() => router.push("/admin/account_code/add")}
      />
    </>
  );
};

export default AccountCode;
