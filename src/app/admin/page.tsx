"use client";

import React from "react";
import {
  useGetCountAllTimeRequestDepartmentQuery,
  useGetCountTodayRequestDepartmentQuery,
} from "@/features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { Dashboard } from "@mui/icons-material";
import PageHeader from "../(component)/pageheader";

const AdminDashboard = () => {
  const { empDetails } = useAuth();

  const { data: allTimeCountByDpt, isLoading: isCountByDptLdng } =
    useGetCountAllTimeRequestDepartmentQuery({
      DPT_ID: empDetails?.CURRENT_DPT_ID,
    });

  const { data: todayCountByDpt, isLoading: isTodayCountByDptLdng } =
    useGetCountTodayRequestDepartmentQuery({
      DPT_ID: empDetails?.CURRENT_DPT_ID,
    });

  //console log
  // useEffect(() => {
  //   if (allTimeCountByDpt) {
  //     console.log("Counts ", allTimeCountByDpt);
  //   }
  // }, [allTimeCountByDpt]);

  if (isCountByDptLdng || isTodayCountByDptLdng) {
    return (
      <span className="text-lg animate-pulse text-center">Loading...</span>
    );
  }

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
            {allTimeCountByDpt.transactionCount}
          </p>
        </div>

        {/**Item count */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">
            Items count per measure: unit / pieces
          </h2>
          <p className="text-3xl font-bold text-blue-600 ">
            {allTimeCountByDpt.itemCountDepartment}
          </p>
        </div>

        {/* Today's Requests Card */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">Today&apos;s Requests</h2>
          <p className="text-3xl font-bold text-amber-700">{todayCountByDpt}</p>
        </div>

        {/* Employee count's Requests Card */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-1">
            Total Employees of {empDetails?.departmentDetails.DEPARTMENT_NAME}
          </h2>
          <p className="text-3xl font-bold text-yellow-600">
            {allTimeCountByDpt.employeeDptCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
