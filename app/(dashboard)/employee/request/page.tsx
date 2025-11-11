"use client";

import { DataTable } from "@/app/(components)/data-table";
import { useGetEmployeeTransactionQuery } from "@/lib/api/transactionApi";
import React, { useState } from "react";
import { transactionColumn } from "./column";

const EmployeeRequest = () => {
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 1,
  });
  const { data, isLoading: isTransactionLoading } =
    useGetEmployeeTransactionQuery();

  const handleChangePageSize = (pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: pageSize,
    }));
  };

  const handlePageIndex = (add: boolean) => {
    if (add) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pagination.pageIndex + 1,
      }));
    }

    if (!add) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pagination.pageIndex - 1,
      }));
    }
  };

  return (
    <DataTable
      data={data?.transactions || []}
      count={data?.count || 0}
      columns={transactionColumn}
      isLoading={isTransactionLoading}
      pageSize={pagination.pageSize}
      pageIndex={pagination.pageIndex}
      handleChangePageSize={handleChangePageSize}
      handlePageIndex={handlePageIndex}
    />
  );
};

export default EmployeeRequest;
