"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useGetItemsByIdQuery } from "@/features/api/apiSlice";
import { BorrowingTransactionTypes } from "@/types/global_types";
import { Modal, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ConfirmModal = ({
  open,
  onClose,
  confirm,
}: {
  open: boolean;
  onClose: () => void;
  confirm: () => void;
}) => {
  return <Modal open={open} onClose={onClose}></Modal>;
};

const RequestForm = () => {
  const { itemId } = useParams();
  //user
  const { empDetails } = useAuth();
  const parsedItemId = Number(itemId);
  const { data: itemDetails, isLoading } = useGetItemsByIdQuery(parsedItemId);

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

  return (
    <>
      <PageHeader pageHead="Request Form" />
      <BackArrow backTo="/employee/request_item" />
      <div className="mb-4 flex flex-col">
        <h1>Item details: </h1>
        <span>Name: {itemDetails?.name ?? "Unknown Item"}</span>
        <span>Qty. {itemDetails?.quantity}</span>
      </div>
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
        <DefaultButton btnText="request" />
      </form>
    </>
  );
};

export default RequestForm;
