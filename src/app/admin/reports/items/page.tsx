"use client";

import axiosInstance from "@/api/axiosInstance";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { Tdata, Thead } from "@/app/(component)/TableParts";
import { useAuth } from "@/context/AuthContext";
import {
  useBuildItemReportQuery,
  useGetAccountItemQuery,
  useGetEmployeeOptionQuery,
} from "@/features/api/apiSlice";
import { DistributedItemProps } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";
import { accountCodeTitle, pesoFormatter } from "@/utils/presoFormatter";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
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

  //account code filter
  const [accountCodeFilter, setAccountCodeFilter] = useState<number | null>(
    null
  );

  //use api rtk
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

  //get item account code
  const { data: accountCodesData, isLoading: isAccountCodeLoading } =
    useGetAccountItemQuery();

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
  const prepareItemReport = useMemo(() => {
    const mapped =
      itemReports?.map((item) => ({
        ...item,
        accCodeDetails: accountCodeTitle(
          item.undistributedItemDetails.accountCodeDetails
        ),
      })) || [];

    // * filter account code
    if (accountCodeFilter !== null) {
      return mapped.filter(
        (item) =>
          item.undistributedItemDetails.ACCOUNT_CODE === accountCodeFilter
      );
    }

    return mapped;
  }, [itemReports, accountCodeFilter]);

  // * prepare table row
  const TableRow = ({ data }: { data: DistributedItemProps }) => (
    <tr>
      <Tdata
        tDataText={accountCodeTitle(
          data.undistributedItemDetails.accountCodeDetails
        )}
      />
      <Tdata tDataText={getItemName(data.undistributedItemDetails)} />
      <Tdata
        tDataText={`${data.quantity}/${data.ORIGINAL_QUANTITY}`}
        minWidth="large"
      />
      <Tdata tDataText={pesoFormatter(data.unit_value)} minWidth="large" />
      <Tdata
        tDataText={fullNamer(data.accountableEmpDetails)}
        minWidth="large"
      />
      <Tdata tDataText={dateFormmater(data.DISTRIBUTED_ON)} minWidth="large" />
    </tr>
  );

  return (
    <>
      <div className="flex gap-1 items-center mb-4">
        <BackArrow />
        <PageHeader pageHead="Build Report" hasMarginBottom={false} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center  w-full items-stretch ">
          <h1 className="mb-1">Distribution Date Range: </h1>
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
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="self-start">Select Employee</h1>
            <Autocomplete
              fullWidth
              loading={isEmployeeOptionLoading}
              disablePortal
              options={mappedEmployeeOption}
              onChange={(_, value) => setEmployeeId(value?.id ?? null)}
              renderInput={(params) => (
                <TextField {...params} label="Employee" />
              )}
            />
          </div>

          {/* ! account code filter */}
          <div className="flex flex-col gap-1">
            <h1>Select Account Code</h1>
            <Autocomplete
              fullWidth
              loading={isAccountCodeLoading}
              disablePortal
              getOptionLabel={(accountCode) =>
                `${accountCode.ACCOUNT_CODE} - ${accountCode.ACCOUNT_TITLE}`
              }
              options={accountCodesData || []}
              onChange={(_, value) =>
                setAccountCodeFilter(value ? value.ID : null)
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Account Code" />
              )}
            />
          </div>
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
