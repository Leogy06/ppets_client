"use client";

import axiosInstance from "@/api/axiosInstance";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useBuildTransactionQuery } from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";
import { transactionStatus, transactionType } from "@/utils/transactions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";

const RequestReports = () => {
  const { empDetails } = useAuth();
  const [dateRange, seDateRange] = useState<{
    startDate: Dayjs;
    endDate: Dayjs;
  }>({
    startDate: dayjs(),
    endDate: dayjs(),
  });
  //request limit to display
  const { data: builtTransactionReport, isLoading: isReportLoading } =
    useBuildTransactionQuery({
      departmentId: Number(empDetails?.CURRENT_DPT_ID),
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });

  const TransactionRowPreview = ({
    index,
    data,
  }: {
    index: number;
    data: TransactionProps;
  }) => (
    <tr className={`${index % 2 === 0 ? "bg-gray-100" : ""}`}>
      <td className="px-4 py-2">{transactionType(data.remarks)}</td>
      {/**transaction type */}
      <td className="px-4 py-2">{dateFormmater(data.createdAt)}</td>
      <td>
        {getItemName(data?.distributedItemDetails?.undistributedItemDetails)}
      </td>
      {/**date requested at  */}
      <td className="px-4 py-2"> {transactionStatus(data.status)}</td>
      {/**status */}
      <td className="px-4 py-2 text-center">{data.quantity}</td>
      {/**borrower  */}
      <td className="px-4 py-2">{fullNamer(data.borrowerEmpDetails)}</td>
      {/**owner  */}
      <td className="px-4 py-2">{fullNamer(data.ownerEmpDetails)}</td>
    </tr>
  );

  const handleGenerateReport = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/pdf`,
        {
          reports: builtTransactionReport,
        },
        { responseType: "blob" }
      );
      console.log("response headers: ", response.headers);
      console.log("blob type: ", response.data.type);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error in previewing pdf", error);
    }
  };

  return (
    <>
      <div className="flex gap-1 items-center mb-4">
        <BackArrow />
        <PageHeader pageHead="Build Report" hasMarginBottom={false} />
      </div>

      {/**Builder tools */}
      <div className=" flex flex-col gap-4 justify-center items-center">
        <h1>Date Range</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex items-center gap-1">
            <DatePicker
              label={"Start Date"}
              value={dateRange.startDate}
              onChange={(newValue) => {
                if (newValue) {
                  seDateRange({
                    ...dateRange,
                    startDate: newValue,
                  });
                }
              }}
            />
            <span>to</span>
            <DatePicker
              label={"End Date"}
              value={dateRange.endDate}
              onChange={(newValue) => {
                if (newValue) {
                  seDateRange({
                    ...dateRange,
                    endDate: newValue,
                  });
                }
              }}
            />
          </div>
        </LocalizationProvider>
      </div>
      <div className="flex justify-end mt-4">
        <DefaultButton
          onClick={handleGenerateReport}
          btnText="Generate Report"
        />
      </div>

      <>
        {isReportLoading ? (
          <span className="text-center">Loading...</span>
        ) : (
          <div className="flex flex-col">
            {builtTransactionReport?.length === 0 ? (
              <span className="text-center">Nothing to Preview</span>
            ) : (
              <div className="flex flex-col max-h-[58vh] overflow-auto">
                <h1 className="mb-4 text-lg font-bold">Preview Report</h1>
                <table>
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Transaction</th>
                      <th className="px-4 py-2">Date Requested</th>
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Borrower</th>
                      <th className="px-4 py-2">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {builtTransactionReport?.map((transaction, index) => (
                      <TransactionRowPreview
                        key={index}
                        index={index}
                        data={transaction}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </>
    </>
  );
};

export default RequestReports;
