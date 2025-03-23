"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateBorrowTransactionMutation,
  useGetItemsByIdQuery,
  useGetUndistributedItemByIdQuery,
} from "@/features/api/apiSlice";
import { BorrowingTransactionTypes } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

//confirm borrow item
const ConfirmBorrow = ({
  open,
  onClose,
  handleBorrowItem,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  handleBorrowItem: () => void;
  loading: boolean;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <h1 className="text-lg font-bold">Confirm Borrow Item?</h1>
      <p className="text-sm mb-4">
        {" "}
        Are you sure you want to borrow this item?{" "}
      </p>
      <div className="flex gap-1 justify-end">
        <DefaultButton
          btnText="cancel"
          variant="text"
          onClick={onClose}
          disabled={loading}
        />
        <DefaultButton
          btnText="confirm"
          onClick={handleBorrowItem}
          disabled={loading}
        />
      </div>
    </DefaultModal>
  );
};

const BorrowItem = () => {
  const { itemId } = useParams();

  //user's details
  const { empDetails } = useAuth();

  const { data: itemDetails, isLoading: isItmLoading } = useGetItemsByIdQuery(
    Number(itemId)
  );

  //get undistributed item
  const { data: undistributedItem } = useGetUndistributedItemByIdQuery(
    Number(itemDetails?.ITEM_ID)
  );

  //use snackbar hook
  const { openSnackbar } = useSnackbar();

  //create borrow api
  const [createBorrowTransaction, { isLoading: isBorrowLoading }] =
    useCreateBorrowTransactionMutation();

  //confirm borrow modal
  const [openModalBorrow, setopenModalBorrow] = useState(false);

  //borrow form
  const [borrowItemForm, setBorrowItemForm] = useState<
    Partial<BorrowingTransactionTypes>
  >({
    distributed_item_id: itemDetails?.ITEM_ID,
    borrower_emp_id: empDetails?.ID,
    owner_emp_id: itemDetails?.accountable_emp,
    quantity: 1,
    DPT_ID: empDetails?.CURRENT_DPT_ID,
    remarks: "",
  });

  //router
  const router = useRouter();

  //   console.log("itemDetails ", itemDetails);

  //handle submit borrow form
  const handleSubmit = async () => {
    try {
      const result = await createBorrowTransaction(borrowItemForm).unwrap();

      console.log("result ", result);
      openSnackbar("Successfully created a request to borrow item.", "success");
      router.push("/manager");
    } catch (error) {
      console.error("Unable to create borrow Transaction. ", error);
      const errMsg = handleError(error, "Unable to create borrow Transaction.");

      openSnackbar(errMsg, "error");
    }
    console.log("submitted! ", borrowItemForm);
  };

  const handleOpenBorrow = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setopenModalBorrow(true);
  };

  //setting distributed item id & owner id
  useEffect(() => {
    if (itemDetails) {
      setBorrowItemForm({
        ...borrowItemForm,
        distributed_item_id: itemDetails.ITEM_ID,
        owner_emp_id: itemDetails.accountable_emp,
      });
    }
  }, [itemDetails]);

  if (isItmLoading) return <p className="animate-pulse">Loading...</p>;

  return (
    <>
      <PageHeader pageHead="Borrow" />
      <BackArrow backTo="/manager" />
      <div className="mt-4">
        <h1>Item Details: </h1>
        <p>{itemDetails?.itemDetails.ITEM_NAME}</p>
        <p>PAR #: {undistributedItem?.PAR_NO}</p>
        <p>
          Accountable Person / Owner:{" "}
          {`${itemDetails?.accountableEmpDetails.LASTNAME}, 
          ${itemDetails?.accountableEmpDetails.FIRSTNAME} ${
            itemDetails?.accountableEmpDetails?.MIDDLENAME ?? ""
          } 
          ${itemDetails?.accountableEmpDetails?.SUFFIX ?? ""}`}
        </p>
      </div>

      <form onSubmit={handleOpenBorrow}>
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
            required={false}
            placeholder="Optional"
          />
          <div className="flex gap-1 justify-end mt-4">
            <DefaultButton btnText="cancel" variant="text" />
            <DefaultButton btnText="submit" type="submit" />
          </div>
        </div>
      </form>
      <ConfirmBorrow
        open={openModalBorrow}
        onClose={() => setopenModalBorrow(false)}
        handleBorrowItem={handleSubmit}
        loading={isBorrowLoading}
      />
    </>
  );
};

export default BorrowItem;
