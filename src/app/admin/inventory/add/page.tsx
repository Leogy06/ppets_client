"use client";
import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateUndistributedItemMutation,
  useGetAccountItemQuery,
} from "@/features/api/apiSlice";
import { AccountItem, UndistributedItem } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import { handleError } from "@/utils/errorHandler";
import { AddBoxOutlined, Inventory2Outlined } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

//day js
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DefaultModal from "@/app/(component)/modal";
import { Autocomplete, TextField } from "@mui/material";

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
  //
  //
  const SpanItemForm = ({
    formField,
    itemField,
  }: {
    formField: string;
    itemField: string | number;
  }) => (
    <span className="flex gap-4">
      {formField}:{" "}
      <p className="font-semibold underline underline-offset-1">{itemField}</p>
    </span>
  );

  //
  //
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
            <SpanItemForm
              formField="Item Name"
              itemField={itemForm?.ITEM_NAME ?? ""}
            />
            <SpanItemForm
              formField="Description"
              itemField={itemForm?.DESCRIPTION ?? ""}
            />
            <SpanItemForm
              formField="Unit Value"
              itemField={itemForm?.UNIT_VALUE ?? ""}
            />
            <SpanItemForm
              formField="Stock"
              itemField={itemForm?.STOCK_QUANTITY ?? ""}
            />
            <SpanItemForm
              formField="Acquisition Date"
              itemField={dateFormmater(
                itemForm?.RECEIVED_AT || null,
                "YYYY-DD-MM"
              )}
            />

            <SpanItemForm
              formField="Serial Number"
              itemField={itemForm?.SERIAL_NO ?? ""}
            />

            <SpanItemForm
              formField="Property Number"
              itemField={itemForm?.PROP_NO ?? ""}
            />

            <SpanItemForm
              formField="Property Acknowledgement Receipt"
              itemField={itemForm?.PAR_NO ?? ""}
            />

            <SpanItemForm
              formField="Material Requisition"
              itemField={itemForm?.MR_NO ?? ""}
            />
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

  //get account item for the account code in item form
  const { data: accountItems, isLoading: isAccountItemLoading } =
    useGetAccountItemQuery({});

  //use states
  //item form state
  const [itemForm, setItemForm] = useState<Partial<UndistributedItem>>({
    ITEM_NAME: "",
    DESCRIPTION: "",
    UNIT_VALUE: 0,
    STOCK_QUANTITY: 0,
    RECEIVED_AT: null,
    PIS_NO: "",
    SERIAL_NO: "",
    PROP_NO: "",
    REMARKS: "",
    PAR_NO: "",
    MR_NO: "",
    ACCOUNT_CODE: 0,
    DEPARTMENT_ID: Number(empDetails?.CURRENT_DPT_ID),
    ADDED_BY: Number(empDetails?.ID),
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

  //handle change add item form
  const handleChangeItemForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setItemForm((prevForm) => ({
      ...prevForm,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value, // Convert number fields properly
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
        className="flex flex-col gap-4 max-h-[32rem] overflow-auto px-4"
      >
        <DefaultTextField
          name="ITEM_NAME"
          label="Item Name"
          value={itemForm.ITEM_NAME}
          onChange={handleChangeItemForm}
        />
        <Autocomplete
          options={accountItems || []}
          loading={isAccountItemLoading}
          getOptionLabel={(option: AccountItem) =>
            `${option.ACCOUNT_CODE} - ${option.ACCOUNT_TITLE}`
          }
          onChange={(_, newValue) => {
            if (newValue) {
              setItemForm((prevForm) => ({
                ...prevForm,
                ACCOUNT_CODE: newValue.ID,
              }));
            }
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Select Account Code"
                fullWidth
                variant="outlined"
                disabled={isAccountItemLoading}
              />
            );
          }}
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
        <TextField
          name="UNIT_VALUE"
          label="Unit value"
          fullWidth
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
          name="PIS_NO"
          label="PIS #"
          value={itemForm.PIS_NO}
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
        <DefaultTextField
          name="PAR_NO"
          label="PAR #"
          value={itemForm.PAR_NO}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="MR_NO"
          label="MR #"
          value={itemForm.MR_NO}
          onChange={handleChangeItemForm}
        />

        {/**ACcount code should be select auto complete */}
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
