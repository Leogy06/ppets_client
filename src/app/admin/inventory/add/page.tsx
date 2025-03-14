"use client";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useCreateUndistributedItemMutation } from "@/features/api/apiSlice";
import { UndistributedItem } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import { handleError } from "@/utils/errorHandler";
import { AddBoxOutlined, Inventory2Outlined } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

//day js
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DefaultModal from "@/app/(component)/modal";

const ConfirmSubmitModal = ({
  open,
  onClose,
  onSubmit,
  itemForm,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  itemForm: Partial<UndistributedItem>;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <>
        <h1 className="text-center text-lg font-semibold">
          <Inventory2Outlined />
          Summary
        </h1>
        <hr />
        {itemForm && (
          <div className="flex flex-col gap-2">
            <span className="flex gap-4">
              Item name | <p className="font-semibold">{itemForm.ITEM_NAME}</p>
            </span>
            <span className="flex gap-4">
              Description |{" "}
              <p className="font-semibold">{itemForm.DESCRIPTION}</p>
            </span>
            <span className="flex gap-4">
              Unit value |{" "}
              <p className="font-semibold">₱ {itemForm.UNIT_VALUE}</p>
            </span>
            <span className="flex gap-4">
              Stock | <p className="font-semibold">{itemForm.STOCK_QUANTITY}</p>
            </span>
            <span className="flex gap-4">
              Date Received |
              <p className="font-semibold">
                {dateFormmater(itemForm.RECEIVED_AT || null, "YYYY-DD-MM")}
              </p>
            </span>
            <span className="flex gap-4">
              Prop | <p className="font-semibold">{itemForm.PROP_NO}</p>
            </span>
            <span className="flex gap-4">
              Serial | <p className="font-semibold">{itemForm.SERIAL_NO}</p>
            </span>
          </div>
        )}
        <div className="flex gap-4 justify-center">
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
      </>
    </DefaultModal>
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
    RECEIVED_AT: null,
    DEPARTMENT_ID: Number(empDetails?.CURRENT_DPT_ID),
    PIC_NO: "",
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
      !itemForm.SERIAL_NO ||
      !itemForm.PROP_NO
    ) {
      openSnackbar("Some required fields are empty. ", "error");
      return;
    }

    setIsModalOpen(true);
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
      <form
        onSubmit={handleOpenModal}
        className="flex flex-col gap-4 max-h-[38rem] overflow-auto px-4"
      >
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
          placeholder="Per piece"
          type="number"
          value={itemForm.UNIT_VALUE ? itemForm.UNIT_VALUE.toString() : ""}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="REMARKS"
          label="Remarks"
          value={itemForm.REMARKS}
          required={false}
          placeholder="optional"
          onChange={handleChangeItemForm}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Received on"
            onChange={(newDate) =>
              setItemForm((prevForm) => ({
                ...prevForm,
                RECEIVED_AT: newDate ? newDate.toDate() : null,
              }))
            }
          />
        </LocalizationProvider>
        <DefaultTextField
          name="PIC_NO"
          label="PIC #"
          value={itemForm.PIC_NO}
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
            disabled={isLoading}
          />
        </div>
      </form>

      <ConfirmSubmitModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitItemForm}
        itemForm={itemForm}
      />
    </>
  );
};

export default AddItem;
