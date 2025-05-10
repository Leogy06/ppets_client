"use client";

import axiosInstance from "@/api/axiosInstance";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { Thead } from "@/app/(component)/TableParts";
import { useAuth } from "@/context/AuthContext";
import {
  useBuildItemReportQuery,
  useGetEmployeeOptionQuery,
} from "@/features/api/apiSlice";
import { DistributedItemProps } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";
import { accountCodeTitle } from "@/utils/presoFormatter";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";

const ItemReports = () => {
  //use detils
  const { empDetails } = useAuth();
  //item report builder filters
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month"),
    endDate: dayjs(),
  });

  const { data: employeeOption, isLoading: isEmployeeOptionLoading } =
    useGetEmployeeOptionQuery(Number(empDetails?.CURRENT_DPT_ID ?? 0));
  //get item report
  const { data: itemReports, isLoading: isItemReportLoading } =
    useBuildItemReportQuery({
      departmentId: Number(empDetails?.CURRENT_DPT_ID),
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      employeeId,
    });
  const handleGenerateItemReport = async () => {
    try {
      const response = await axiosInstance.post(`/api/pdf/items`, {
        reports: prepareItemReport,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error in previewing item report pdf: ", error);
    }
  };

  // * prepare employee filter
  const mappedEmployeeOption = useMemo(
    () =>
      employeeOption?.map((employee) => ({
        label: `${employee.ID_NUMBER} - ${fullNamer(employee)}`,
        id: employee.ID,
      })) || [],
    [employeeOption]
  );

  // * prepare item to report
  const prepareItemReport = useMemo(
    () =>
      itemReports?.map((item) => ({
        ...item,
        accCodeDetails: accountCodeTitle(
          item.undistributedItemDetails.accountCodeDetails
        ),
      })),
    [itemReports]
  );

  const TableRow = ({ data }: { data: DistributedItemProps }) => (
    <tr>
      <td className="px-4 py-2">
        {accountCodeTitle(data.undistributedItemDetails.accountCodeDetails)}
      </td>
      <td className="px-4 py-2">
        {getItemName(data.undistributedItemDetails)}
      </td>
      <td className="px-4 py-2">
        {data.quantity}/{data.ORIGINAL_QUANTITY}
      </td>
      <td className="px-4 py-2">{data.unit_value}</td>
      <td className="px-4 py-2">{fullNamer(data.accountableEmpDetails)}</td>
      <td className="px-4 py-2">{dateFormmater(data.DISTRIBUTED_ON)}</td>
    </tr>
  );

  return (
    <>
      <div className="flex gap-1 items-center mb-4">
        <BackArrow />
        <PageHeader pageHead="Build Report" hasMarginBottom={false} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="mb-1">Distribution Date Range</h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex gap-1 items-center">
              <DatePicker
                label="From"
                value={dateRange.startDate}
                onChange={(newValue) => {
                  if (newValue) {
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: newValue,
                    }));
                  }
                }}
              />
              <span>to</span>
              <DatePicker
                label="To"
                value={dateRange.endDate}
                onChange={(newValue) => {
                  if (newValue) {
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: newValue,
                    }));
                  }
                }}
              />
            </div>
          </LocalizationProvider>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="self-start">Select Employee</h1>
          <Autocomplete
            fullWidth
            loading={isEmployeeOptionLoading}
            disablePortal
            options={mappedEmployeeOption}
            onChange={(_, value) => setEmployeeId(value?.id ?? null)}
            renderInput={(params) => <TextField {...params} label="Employee" />}
          />
        </div>
        <div className="flex justify-end">
          <DefaultButton
            btnText="Generate Report"
            onClick={handleGenerateItemReport}
          />
        </div>
      </div>

      <h1 className="text-lg font-bold mt-4">Preview Item Report</h1>
      {isItemReportLoading ? (
        <p className="text-center animate-pulse">Loading...</p>
      ) : (
        <div className="mt-4 w-full max-h-[40vh] overflow-auto">
          <table className=" min-w-[1000px] table-auto">
            <thead className="border-b border-gray-900">
              <tr>
                <Thead theadText="Account Code" />
                <Thead theadText="Item" />
                <Thead theadText="Quantity" />
                <Thead theadText="Unit Value" />
                <Thead theadText="Accountable Person" />
                <Thead theadText="Distribution Date" />
              </tr>
            </thead>
            <tbody>
              {prepareItemReport?.map((item, index) => (
                <TableRow key={index} data={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ItemReports;
