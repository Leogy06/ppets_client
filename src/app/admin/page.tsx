"use client";

import React from "react";

import { useAuth } from "@/context/AuthContext";
import { Dashboard } from "@mui/icons-material";
import PageHeader from "@/app/(component)/pageheader";
import {
  useGetEmployeeCountQuery,
  useGetTransactionCountQuery,
  useGetTransactionCountTodayQuery,
  useGetUndistributedItemCountQuery,
} from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const { empDetails } = useAuth();
  //router navigation
  const router = useRouter();

  //get employee count
  const { data: employeeCount } = useGetEmployeeCountQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  //get requests counts
  const { data: transactionCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
  });

  //get distributed item base on department
  const { data: undistributedItemCount } = useGetUndistributedItemCountQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  //get tranasciton count today
  const { data: transactionCountToday } = useGetTransactionCountTodayQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
  });

  return (
    <div className="p-4">
      <PageHeader
        icon={Dashboard}
        pageHead={`${
          empDetails?.departmentDetails?.DEPARTMENT_NAME ?? ""
        }'s Dashboard`}
      />

      <p className="text-sm mb-4">
        Admin:{" "}
        {`${empDetails?.LASTNAME}, ${empDetails?.FIRSTNAME} ${
          empDetails?.MIDDLENAME ?? ""
        } ${empDetails?.SUFFIX ?? ""}`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* All Time Requests Card */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">
            All Time Total Requests
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {transactionCount}
          </p>
          <div className="flex justify-end text-sm">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => router.push("/admin/reports/requests")}
            >
              See Requests
            </button>
          </div>
        </div>

        {/**undistributed Item count distributed Item count */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">
            Items count per measure: unit / pieces
          </h2>
          <p className="text-3xl font-bold text-blue-600 ">
            {undistributedItemCount}
          </p>
        </div>

        {/* Today's Requests Card */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">Today&apos;s Requests</h2>
          <p className="text-3xl font-bold text-amber-700">
            {transactionCountToday}
          </p>
        </div>

        {/* Employee count's Requests Card */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">Total Employees of:</h2>
          <p className="text-3xl font-bold text-yellow-600">{employeeCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
