"use client";

import BackArrow from "@/app/(component)/backArrow";
// import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useGetTransactionByIdQuery } from "@/features/api/apiSlice";
import { dateFormmater } from "@/utils/date_formmater";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";
import { transactionStatus } from "@/utils/transactions";
import { InfoOutlined } from "@mui/icons-material";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const TransactionDetails = () => {
  const { transaction_id } = useParams();
  const { data: transaction, isLoading: isTransactionLoading } =
    useGetTransactionByIdQuery(Number(transaction_id));
  useEffect(() => {
    if (transaction) {
      console.log("transaction ", transaction);
    }
  }, [transaction]);

  return (
    <>
      <div className="flex items-center gap-1">
        <BackArrow />
        <PageHeader
          pageHead="Transaction Details"
          icon={InfoOutlined}
          hasMarginBottom={false}
        />
      </div>
      {isTransactionLoading && (
        <div className="flex justify-center animate-pulse">Loading...</div>
      )}
      <div className="flex flex-col justify-between items-center">
        <div className="mt-6 p-6 rounded-2xl bg-white shadow-md border border-gray-200 w-full max-w-xl">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Transaction Information
          </h2>
          <div className="text-base text-gray-600 space-y-2">
            <p>
              <span className="font-medium text-gray-800">Item:</span>{" "}
              {getItemName(
                transaction?.distributedItemDetails?.undistributedItemDetails
              ) || "N/A"}
            </p>
            {/* Add more details like below if needed */}
            <p>
              <span className="font-medium">Quantity:</span>{" "}
              {transaction?.quantity}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {transactionStatus(Number(transaction?.status))}
            </p>
            <p>
              <span className="font-medium">Owner:</span>{" "}
              {transaction?.ownerEmpDetails
                ? fullNamer(transaction?.ownerEmpDetails)
                : "N/A"}
            </p>
            <p>
              <span className="font-medium">Borrower:</span>{" "}
              {transaction?.ownerEmpDetails
                ? fullNamer(transaction?.borrowerEmpDetails)
                : "N/A"}
            </p>
            <p>
              <span className="font-medium">Issue on:</span>{" "}
              {dateFormmater(transaction?.createdAt ?? null, "MMMM/DD/YYYY")}
            </p>
          </div>
        </div>
        {/* <div className="mt-4">
          <DefaultButton
            disabled={transaction?.status !== 2}
            btnText="reject"
            variant="text"
            color="error"
          />
          <DefaultButton
            disabled={transaction?.status !== 2}
            btnText="Approve"
          />
        </div> */}
      </div>
    </>
  );
};

export default TransactionDetails;
