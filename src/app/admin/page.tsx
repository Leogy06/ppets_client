"use client";

import React, { useEffect } from "react";
import PageHeader from "../(component)/pageheader";
import { Dashboard } from "@mui/icons-material";
import {
  useGetCountAllTimeRequestDepartmentQuery,
  useGetCountTodayRequestDepartmentQuery,
} from "@/features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";

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
  useEffect(() => {
    if (allTimeCountByDpt) {
      console.log("Counts ", allTimeCountByDpt);
    }
  }, [allTimeCountByDpt]);

  if (isCountByDptLdng || isTodayCountByDptLdng) {
    return (
      <span className="text-lg animate-pulse text-center">Loading...</span>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">
        {empDetails?.departmentDetails &&
          empDetails?.departmentDetails?.DEPARTMENT_NAME + " 's Dashboard"}
      </h1>
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
          <p className="text-3xl font-bold text-blue-600">
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
          <h2 className="text-lg font-semibold mb-1">Today's Requests</h2>
          <p className="text-3xl font-bold text-green-600">{todayCountByDpt}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
