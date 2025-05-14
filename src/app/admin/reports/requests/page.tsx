"use client";

import axiosInstance from "@/api/axiosInstance";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useBuildTransactionQuery,
  useGetEmployeeOptionQuery,
} from "@/features/api/apiSlice";
import { TransactionProps } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";
import { transactionStatus, transactionType } from "@/utils/transactions";
import { Info } from "@mui/icons-material";
import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";

const RequestReports = () => {
  const { empDetails } = useAuth();

  // * use states
  // date filter
  const [dateRange, seDateRange] = useState<{
    startDate: Dayjs;
    endDate: Dayjs;
  }>({
    startDate: dayjs().startOf("month"),
    endDate: dayjs(),
  });

  // borrower filter
  const [borrowerFilter, setBorrowerFilter] = useState<number | null>(null);

  //owner filter
  const [ownerFilter, setOwnerFilter] = useState<number | null>(null);

  //request limit to display
  const { data: builtTransactionReport, isLoading: isReportLoading } =
    useBuildTransactionQuery({
      departmentId: Number(empDetails?.CURRENT_DPT_ID),
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });

  //get employee option for the filter
  const { data: employeeOptions } = useGetEmployeeOptionQuery(
    Number(empDetails?.CURRENT_DPT_ID),
    {
      skip: !empDetails?.CURRENT_DPT_ID,
    }
  );

  //transaction type filter
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    number | null
  >(null);

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
      const response = await axiosInstance.post(`/api/pdf`, {
        reports: preparedTransactions,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error in previewing pdf", error);
    }
  };

  //option

  //transaction type option
  const transactionTypeOptions = [
    { id: 1, label: "BORROWING" },
    { id: 2, label: "LENDING" },
    { id: 3, label: "DISTRIBUTION" },
    { id: 4, label: "TRANSFER" },
    { id: 5, label: "RETURN" },
  ];

  //prepare transactions
  const preparedTransactions = useMemo(() => {
    return builtTransactionReport?.filter((transaction) => {
      // * filters
      //transaction type
      const matchesType =
        transactionTypeFilter === null ||
        transaction.remarks === transactionTypeFilter;

      //borrower
      const matchesBorrower =
        borrowerFilter === null ||
        transaction.borrower_emp_id === borrowerFilter;

      //owner
      const matchesOwner =
        ownerFilter === null || transaction.owner_emp_id === ownerFilter;

      return matchesType && matchesBorrower && matchesOwner;
    });
  }, [builtTransactionReport, transactionTypeFilter, borrowerFilter]);

  //prepaer borrower employee options
  const prepareBorrowerEmployeeOptions = useMemo(
    () =>
      employeeOptions?.map((employee) => ({
        label: fullNamer(employee),
        id: employee.ID,
      })),
    [employeeOptions]
  );

  //prepare
  const prepareOwnerEmployeeOptions = useMemo(
    () =>
      employeeOptions?.map((employee) => ({
        label: fullNamer(employee),
        id: employee.ID,
      })),
    [employeeOptions]
  );
  //prepare  transaction for csv
  const exportToCsv = () => {
    const headers = [
      "Transaction Type",
      "Date Requested",
      "Item",
      "Status",
      "Quantity",
      "Borrower",
      "Owner",
    ];

    const rows = (preparedTransactions ?? []).map((transaction) => [
      transactionType(transaction.remarks),
      dateFormmater(transaction.createdAt),
      getItemName(
        transaction?.distributedItemDetails?.undistributedItemDetails
      ),
      transactionStatus(transaction.status),
      transaction.quantity,
      fullNamer(transaction.borrowerEmpDetails),
      fullNamer(transaction.ownerEmpDetails),
    ]);

    //create csv content
    const csvContent =
      "data:text/csv;charset=utf8," +
      [headers, ...rows].map((e) => e.join(", ")).join("\n");

    const encodeUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodeUri);
    link.setAttribute("download", "transaction_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex gap-1 items-center mb-4">
        <BackArrow />
        <PageHeader pageHead="Build Report" hasMarginBottom={false} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 gap-4 justify-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <h1>Date Range</h1>
            <DatePicker
              label="From"
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
            <DatePicker
              label="To"
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
        </div>

        {/*  transaction type filter  */}
        <Autocomplete
          options={transactionTypeOptions}
          getOptionLabel={(option) => option.label}
          onChange={(_, value) =>
            setTransactionTypeFilter(value ? value.id : null)
          }
          renderInput={(params) => (
            <TextField {...params} label="Select Transaction Type" />
          )}
        />

        {/* borrower filter */}
        <Autocomplete
          options={prepareBorrowerEmployeeOptions || []}
          onChange={(_, value) => setBorrowerFilter(value ? value.id : null)}
          renderInput={(params) => (
            <TextField {...params} label="Select Borrower" />
          )}
        />

        {/* owner filter */}
        <Autocomplete
          options={prepareOwnerEmployeeOptions || []}
          onChange={(_, value) => setOwnerFilter(value ? value.id : null)}
          renderInput={(params) => (
            <TextField {...params} label="Select Owner" />
          )}
        />
      </div>
      <div className="flex justify-end my-4">
        <DefaultButton onClick={handleGenerateReport} btnText="Export to pdf" />{" "}
        <DefaultButton
          onClick={exportToCsv}
          btnText="Export to CSV"
          variant="text"
        />
      </div>

      <>
        {isReportLoading ? (
          <span className="text-center">Loading...</span>
        ) : (
          <div className="flex flex-col">
            {builtTransactionReport?.length === 0 ? (
              <span className="text-center">Nothing to Preview </span>
            ) : (
              <div className="flex flex-col max-h-[3] md:max-h-[40vh] overflow-auto">
                <h1 className="mb-4 text-lg font-bold">
                  Preview Report{" "}
                  <Tooltip
                    title={
                      <p className="text-sm">
                        For the TRANSFER transaction, the owner is where the
                        item from, and the borrower is where the item goes.
                      </p>
                    }
                    placement="top"
                  >
                    <Info />
                  </Tooltip>
                </h1>
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
                    {preparedTransactions?.map((transaction, index) => (
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
