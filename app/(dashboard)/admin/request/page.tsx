"use client";

import { DataTable } from "@/app/(components)/data-table";
import { PageHeader } from "@/app/(components)/page-header";
import { useGetTransactionQuery } from "@/lib/api/transactionApi";
import React, { useEffect, useState } from "react";
import { requestColumns } from "./column";
import { useSocket } from "@/app/(hooks)/webSocketHook";

const Request = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data, isLoading: isTransactionLoading } = useGetTransactionQuery({
    pageIndex,
    pageSize,
  });

  const handleChangePage = (val: number) => {
    setPageSize(val);
  };

  const handlePageIndex = (add: boolean) => {
    if (add) {
      setPageIndex((prev) => prev + 1);
    }
    if (!add) {
      setPageIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <section>
        <PageHeader text="Requests" />
      </section>
      <DataTable
        data={data?.transactions || []}
        columns={requestColumns}
        isLoading={isTransactionLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        count={data?.count ?? 0}
        handlePageIndex={handlePageIndex}
        handleChangePageSize={handleChangePage}
      />
    </>
  );
};

export default Request;
