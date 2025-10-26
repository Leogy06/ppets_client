import { DataTable } from "@/app/(components)/data-table";
import React, { useState } from "react";
import { archiveEmployeeColumns } from "./columns";
import { useGetAllArchivedEmployeeQuery } from "@/lib/api/employeeApi";

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

  return (
    <div className="container mx-auto py-10">
      <DataTable
        isLoading={isEmployeeDataLoading}
        data={employeeData?.employees || []}
        columns={archiveEmployeeColumns}
      />
    </div>
  );
};

export default ArchivedEmployees;
