"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddBorrowingTransactionMutation,
  useGetItemsByIdQuery,
} from "@/features/api/apiSlice";
import { BorrowingTransactionTypes } from "@/types/global_types";
import { Modal } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const ConfirmModal = ({
  open,
  onClose,
  confirm,
}: {
  open: boolean;
  onClose: () => void;
  confirm: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-4 justify-center">
        <h1 className="text-lg font-semibold text-center">Confirm Request?</h1>
        <div className="flex items-center gap-2">
          <DefaultButton btnText="cancel" variant="text" onClick={onClose} />
          <DefaultButton btnText="request" onClick={confirm} />
        </div>
      </div>
    </Modal>
  );
};

const RequestForm = () => {
  const { itemId } = useParams();
  const parsedItemId = Number(itemId);

  const { empDetails } = useAuth();
  //api
  //get item
  const { data: itemDetails, isLoading: isItmLdng } =
    useGetItemsByIdQuery(parsedItemId);

  //add transaction
  const [addTransaction] = useAddBorrowingTransactionMutation();

  //snackbar
  const { openSnackbar } = useSnackbar();

  const [requestItemForm, setRequestItemForm] = useState<
    Partial<BorrowingTransactionTypes>
  >({
    borrowedItem: itemDetails?.id,
    borrower: empDetails?.ID,
    owner: itemDetails?.accountable_emp,
    quantity: 0,
    status: 1,
    remarks: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestItemForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!requestItemForm.quantity || requestItemForm.quantity < 1) {
      openSnackbar("Required fields are missing. ", "error");
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmitApi = async () => {
    try {
      const result = await addTransaction({
        borrowedItems: requestItemForm,
        borrower: empDetails?.ID,
        owner: itemDetails?.accountable_emp,
      }).unwrap();
      console.log("result ", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageHeader pageHead="Request Form" />
      <BackArrow backTo="/employee/request_item" />
      {isItmLdng ? (
        "Loading..."
      ) : (
        <div className="mb-4 flex flex-col">
          <h1>Item details: </h1>
          <span>Name: {itemDetails?.name ?? "Unknown Item"}</span>
          <span>Qty. {itemDetails?.quantity}</span>
        </div>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <DefaultTextField
          name="quantity"
          label="Quantity"
          onChange={handleRequestFormChange}
          type="number"
        />
        <DefaultTextField
          name="remarks"
          label="Reason for the request"
          onChange={handleRequestFormChange}
        />
        <DefaultButton btnText="request" type="submit" />
      </form>
      <ConfirmModal
        confirm={handleSubmitApi}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default RequestForm;
