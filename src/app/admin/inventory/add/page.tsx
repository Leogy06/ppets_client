"use client";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useCreateUndistributedItemMutation } from "@/features/api/apiSlice";
import { UndistributedItem } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { AddBoxOutlined } from "@mui/icons-material";
import { Modal, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ConfirmSubmitModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Modal open={open}>
      <div className=" bg-white p-4 gap-4  rounded-lg border border-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col">
        <h1 className="text-center text-base font-semibold">
          Confirm Add Item?{" "}
        </h1>
        <div className="flex gap-4">
          <DefaultButton
            onClick={onClose}
            btnText="cancel"
            title="Cancel the Item"
            placement="top"
            variant="text"
          />
          <DefaultButton
            onClick={onSubmit}
            btnText="confirm"
            title="Save the Item"
            placement="top"
          />
        </div>
      </div>
    </Modal>
  );
};

const AddItem = () => {
  //use hooks
  //create items
  const [createUndistributedItem, { isLoading }] =
    useCreateUndistributedItemMutation();

  //snackbar
  const { openSnackbar } = useSnackbar();

  //auth
  const { empDetails } = useAuth();

  //router
  const router = useRouter();

  //use states
  //item form state
  const [itemForm, setItemForm] = useState<Partial<UndistributedItem>>({
    ITEM_NAME: "",
    DESCRIPTION: "",
    STOCK_QUANTITY: 0,
    UNIT_VALUE: 0,
    REMARKS: "",
    SERIAL_NO: "",
    PROP_NO: "",
    DEPARTMENT_ID: Number(empDetails?.CURRENT_DPT_ID),
  });

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //form submit (just to open modal);
  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !itemForm.ITEM_NAME ||
      !itemForm.DESCRIPTION ||
      !itemForm.STOCK_QUANTITY ||
      !itemForm.UNIT_VALUE ||
      !itemForm.REMARKS ||
      !itemForm.SERIAL_NO ||
      !itemForm.PROP_NO
    ) {
      openSnackbar("Some required fields are empty. ", "error");
      return;
    }

    setIsModalOpen(true);
  };

  //close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemForm({
      ITEM_NAME: "",
      DESCRIPTION: "",
      STOCK_QUANTITY: 0,
      UNIT_VALUE: 0,
      REMARKS: "",
      SERIAL_NO: "",
      PROP_NO: "",
    });
  };

  //handles
  //submit item form
  const handleSubmitItemForm = async () => {
    try {
      await createUndistributedItem(itemForm).unwrap();
      openSnackbar("Item added successfully!", "success");
      router.push("/admin/inventory");
    } catch (error) {
      console.error("Unable to submit item. ", error);
      const errMsg = handleError(error, "Unable to submit item. ");
      openSnackbar(errMsg, "error");
    }
  };

  const handleChangeItemForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setItemForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex flex-col items-start mb-8">
        <PageHeader pageHead="Add Item" icon={AddBoxOutlined} />
        <BackArrow backTo="/admin/inventory" />
      </div>
      <form onSubmit={handleOpenModal} className="flex flex-col gap-4">
        <DefaultTextField
          name="ITEM_NAME"
          label="Item Name"
          value={itemForm.ITEM_NAME}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="DESCRIPTION"
          label="Description"
          value={itemForm.DESCRIPTION}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="STOCK_QUANTITY"
          label="Quantity"
          type="number"
          value={
            itemForm.STOCK_QUANTITY ? itemForm.STOCK_QUANTITY.toString() : ""
          }
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="UNIT_VALUE"
          label="Unit value"
          type="number"
          value={itemForm.UNIT_VALUE ? itemForm.UNIT_VALUE.toString() : ""}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="REMARKS"
          label="Remarls"
          value={itemForm.REMARKS}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="SERIAL_NO"
          label="SERIAL #"
          value={itemForm.SERIAL_NO}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="PROP_NO"
          label="PROP #"
          value={itemForm.PROP_NO}
          onChange={handleChangeItemForm}
        />
        <div className="flex gap-2 justify-center md:justify-end">
          <DefaultButton
            btnText="submit"
            type="submit"
            title="Proceed confirm"
          />
        </div>
      </form>

      <ConfirmSubmitModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitItemForm}
      />
    </>
  );
};

export default AddItem;
