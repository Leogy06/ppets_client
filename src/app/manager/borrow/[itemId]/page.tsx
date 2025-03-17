"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateBorrowTransactionMutation,
  useGetItemsByIdQuery,
} from "@/features/api/apiSlice";
import { BorrowingTransactionTypes } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const BorrowItem = () => {
  const { itemId } = useParams();

  //user's details
  const { empDetails } = useAuth();

  const { data: itemDetails, isLoading: isItmLoading } = useGetItemsByIdQuery(
    Number(itemId)
  );

  //use snackbar hook
  const { openSnackbar } = useSnackbar();

  //create borrow api
  const [createBorrowTransaction] = useCreateBorrowTransactionMutation();

  //borrow form
  const [borrowItemForm, setBorrowItemForm] = useState<
    Partial<BorrowingTransactionTypes>
  >({
    distributed_item_id: itemDetails?.ID,
    borrower_emp_id: empDetails?.ID,
    owner_emp_id: itemDetails?.accountable_emp,
    quantity: 1,
    DPT_ID: empDetails?.CURRENT_DPT_ID,
    remarks: "",
  });

  //   console.log("itemDetails ", itemDetails);

  //handle submit borrow form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createBorrowTransaction(borrowItemForm).unwrap();

      console.log("result ", result);
      openSnackbar("Successfully created borrow transaction.", "success");
    } catch (error) {
      console.error("Unable to create borrow Transaction. ", error);
      const errMsg = handleError(error, "Unable to create borrow Transaction.");

      openSnackbar(errMsg, "error");
    }
    console.log("submitted! ", borrowItemForm);
  };

  if (isItmLoading) return <p className="animate-pulse">Loading...</p>;

  return (
    <>
      <PageHeader pageHead="Borrow" />
      <BackArrow backTo="/manager" />
      <div className="mt-4">
        <h1>Item Details: </h1>
        <p>{itemDetails?.itemDetails.ITEM_NAME}</p>
        <p>PAR #: {itemDetails?.itemDetails.PAR_NO}</p>
        <p>
          Accountable Person / Owner:{" "}
          {`${itemDetails?.accountableEmpDetails.LASTNAME}, 
          ${itemDetails?.accountableEmpDetails.FIRSTNAME} ${
            itemDetails?.accountableEmpDetails?.MIDDLENAME ?? ""
          } 
          ${itemDetails?.accountableEmpDetails?.SUFFIX ?? ""}`}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mt-4">
          <DefaultTextField
            name="quantity"
            type="number"
            value={
              borrowItemForm.quantity ? String(borrowItemForm.quantity) : ""
            }
            onChange={(e) =>
              setBorrowItemForm({
                ...borrowItemForm,
                quantity: Number(e.target.value),
              })
            }
            label="Quantity"
          />
          <DefaultTextField
            name="remarks"
            type="text"
            value={borrowItemForm.remarks || ""}
            onChange={(e) =>
              setBorrowItemForm({ ...borrowItemForm, remarks: e.target.value })
            }
            label="Remarks"
          />
          <div className="flex gap-1 justify-end mt-4">
            <DefaultButton btnText="cancel" variant="text" />
            <DefaultButton btnText="submit" type="submit" />
          </div>
        </div>
      </form>
    </>
  );
};

export default BorrowItem;
