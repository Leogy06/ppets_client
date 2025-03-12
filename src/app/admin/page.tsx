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
  //use auth
  const { empDetails } = useAuth();

  //all time request count
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
    if (allTimeCountByDpt && todayCountByDpt) {
      console.log("Time count ", allTimeCountByDpt);
      console.log("Today Time count ", todayCountByDpt);
    }
  }, [allTimeCountByDpt, todayCountByDpt]);

  if (isCountByDptLdng || isTodayCountByDptLdng) {
    return (
      <span className="text-lg animate-pulse text-center">Loading...</span>
    );
  }

  return (
    <>
      <PageHeader icon={Dashboard} pageHead="Dashboard" />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold">
            {empDetails?.departmentDetails.DEPARTMENT_NAME}&apos;s
          </h1>
        </div>
        <p className="flex gap-1 items-center">
          All Time Total Request:
          <span className="text-lg font-semibold underline underline-offset-1">
            {allTimeCountByDpt}
          </span>
        </p>
        <p>
          Today&apos;s Request:{" "}
          <span className="text-lg font-semibold underline underline-offset-1">
            {todayCountByDpt}
          </span>
        </p>
      </div>
    </>
  );
};

export default AdminDashboard;
