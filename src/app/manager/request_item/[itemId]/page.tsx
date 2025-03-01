"use client";

import PageHeader from "@/app/(component)/pageheader";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddBorrowingTransactionMutation,
  useGetItemsByIdQuery,
} from "@/features/api/apiSlice";
import { BorrowingTransactionTypes, Item } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const RquestForm = () => {
  const { itemId } = useParams();

  const { data: itemDetails, isLoading } = useGetItemsByIdQuery(Number(itemId));

  const [addBorrowingTransaction] = useAddBorrowingTransactionMutation();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //use state
  const [borrowForm, setBorrowForm] = useState<
    Partial<BorrowingTransactionTypes>
  >({});

  //needed to re create the borrow transaction
  //handles
  const handleAddBorrowingTransaction = async () => {
    try {
      const result = await addBorrowingTransaction({ borrowForm }).unwrap();

      console.log("result ", result);
    } catch (error) {
      console.error("Unexpecter error occurred. ", error);
      const errMg = handleError(error, "Unexpected error occurred.");

      openSnackbar(errMg, "error");
    }
  };

  useEffect(() => {
    if (itemDetails) {
      console.log("item details ", itemDetails);
    }
  }, [itemDetails]);

  return (
    <>
      <PageHeader pageHead="Request Form" />
      {itemDetails && !isLoading && (
        <div className="flex flex-col gap-4">
          <span className="flex items-center text-base">
            Item |{" "}
            <p className=" font-medium">{itemDetails?.itemDetails.ITEM_NAME}</p>
          </span>
          <span className="flex items-center text-base">
            <p className=" font-medium">Quantity | {itemDetails.quantity}</p>
          </span>
          <span className="flex items-center text-base">
            <p className=" font-medium">
              Unit value | {itemDetails.unit_value}
            </p>
          </span>
          <span className="flex items-center text-base">
            <p className=" font-medium">
              Total value | {itemDetails.total_value}
            </p>
          </span>
        </div>
      )}

      <form></form>
    </>
  );
};

export default RquestForm;
