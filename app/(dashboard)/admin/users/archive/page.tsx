"use client";

import { DataTable } from "@/app/(components)/data-table";
import React, { useState, useTransition } from "react";
import { archiveEmployeeColumns } from "./columns";
import { useGetAllArchivedEmployeeQuery } from "@/lib/api/employeeApi";
import { PageHeader } from "@/app/(components)/page-header";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const ArchivedEmployees = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchedEmployee, setSearchedEmployee] = useState("");
  const { data: employeeData, isLoading: isEmployeeDataLoading } =
    useGetAllArchivedEmployeeQuery({
      pageIndex,
      pageSize,
      employeeName: searchedEmployee,
    });

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleBacktoEmployee = () => {
    startTransition(() => router.back());
  };

  //pagination
  const handlChangePageSize = (val: number) => {
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
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex items-center gap-2">
        <Button
          title={isPending ? "Loading..." : "Go back"}
          variant={"ghost"}
          onClick={handleBacktoEmployee}
        >
          <ArrowLeft />
        </Button>
        <PageHeader text="Archived Employee" />
      </div>
      <Input
        value={searchedEmployee || ""}
        className="w-[260px]"
        placeholder="Search employee"
        onChange={(e) => setSearchedEmployee(e.target.value)}
      />
      <DataTable
        isLoading={isEmployeeDataLoading}
        data={employeeData?.employees || []}
        columns={archiveEmployeeColumns}
        //pagination
        handleChangePageSize={handlChangePageSize}
        pageSize={pageSize}
        pageIndex={pageIndex}
        count={employeeData?.count || 0}
        handlePageIndex={handlePageIndex}
      />
    </div>
  );
};

export default ArchivedEmployees;
