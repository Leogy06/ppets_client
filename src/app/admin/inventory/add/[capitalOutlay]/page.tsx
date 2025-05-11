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
import { useParams, useRouter } from "next/navigation";
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
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  itemForm: Partial<UndistributedItem>;
  isLoading: boolean;
}) => {
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

  const formFields = [
    { label: "Item Name", value: itemForm?.ITEM_NAME ?? "" },
    { label: "Description", value: itemForm?.DESCRIPTION ?? "" },
    { label: "Unit Value", value: itemForm?.UNIT_VALUE ?? "" },
    { label: "Stock", value: itemForm?.STOCK_QUANTITY ?? "" },
    {
      label: "Acquisition Date",
      value: dateFormmater(itemForm?.RECEIVED_AT || null, "YYYY-MM-DD"),
    },
    { label: "Serial Number", value: itemForm?.SERIAL_NO ?? "" },
    { label: "Property Number", value: itemForm?.PROP_NO ?? "n/a" },
    {
      label: "Property Acknowledgement Receipt",
      value: itemForm?.PAR_NO ?? "--",
    },
    { label: "Material Requisition", value: itemForm?.MR_NO ?? "n/a" },
    { label: "PIS/ICS", value: itemForm?.PIS_NO ?? "n/a" },
  ];

  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="max-h-[70vh] overflow-auto">
        <h1 className="text-center text-lg font-semibold mb-2">
          <Inventory2Outlined />
          Summary
        </h1>
        <hr />
        {itemForm && (
          <div className="flex flex-col gap-2 mt-2">
            {formFields.map(({ label, value }) => (
              <SpanItemForm key={label} formField={label} itemField={value} />
            ))}
          </div>
        )}
        <div className="flex gap-4 justify-end mt-2">
          <DefaultButton
            onClick={onClose}
            btnText="cancel"
            title="Cancel the Item"
            placement="top"
            variant="text"
            disabled={isLoading}
          />
          <DefaultButton
            onClick={onSubmit}
            btnText="confirm"
            title="Save the Item"
            placement="top"
            disabled={isLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );
};

const AddItem = () => {
  //use hooks
  //create items

  //use params
  const { capitalOutlay } = useParams();

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
    useGetAccountItemQuery();

  //use states
  //item form state
  const [itemForm, setItemForm] = useState<Partial<UndistributedItem>>({
    ITEM_NAME: "",
    DESCRIPTION: "",
    UNIT_VALUE: 0,
    STOCK_QUANTITY: 1,
    RECEIVED_AT: null,
    PIS_NO: "",
    SERIAL_NO: "",
    PROP_NO: "",
    REMARKS: "",
    PAR_NO: "",
    MR_NO: "",
    ICS_NO: "",
    ACCOUNT_CODE: 0,
    DEPARTMENT_ID: Number(empDetails?.CURRENT_DPT_ID),
    ADDED_BY: Number(empDetails?.ID),
  });

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //form submit (just to open modal);
  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsModalOpen(true);
  };

  //handles
  //submit item form
  const handleSubmitItemForm = async () => {
    if (capitalOutlay === "down" && itemForm.UNIT_VALUE) {
      if (parseFloat(itemForm.UNIT_VALUE.toString()) > 50000) {
        openSnackbar(
          "Capital outlay is 50k down and the unit value cannot be greater than 50k",
          "error"
        );
        return;
      }
    }
    if (capitalOutlay === "up" && itemForm.UNIT_VALUE) {
      if (parseFloat(itemForm.UNIT_VALUE.toString()) < 50000) {
        openSnackbar(
          "Capital outlay is 50k up and the unit value cannot be less than 50k",
          "error"
        );
        return;
      }
    }

    try {
      //prefetch the inventory page
      router.prefetch("/admin/inventory");

      const preparedForm = {
        ...itemForm,
        UNIT_VALUE: itemForm.UNIT_VALUE
          ? parseFloat(itemForm.UNIT_VALUE.toString())
          : 0,
        STOCK_QUANTITY: itemForm.STOCK_QUANTITY
          ? parseInt(itemForm.STOCK_QUANTITY.toString())
          : 1,
      };

      await createUndistributedItem(preparedForm).unwrap();
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
      [name]: type === "number" ? value : value.trim() === "" ? null : value,
    }));
  };

  return (
    <>
      <div className="flex items-start mb-4 justify-between">
        <div className="flex items-center">
          <BackArrow backTo="/admin/inventory" />
          <PageHeader
            pageHead="Add Item"
            icon={AddBoxOutlined}
            hasMarginBottom={false}
          />
        </div>
        <h2>Capital Outlay 50k {String(capitalOutlay).toUpperCase() || ""}</h2>
      </div>
      <form
        onSubmit={handleOpenModal}
        className="flex flex-col gap-4 max-h-[32rem] overflow-auto px-4 py-2"
      >
        <DefaultTextField
          name="ITEM_NAME"
          label="Item Name"
          value={itemForm.ITEM_NAME || ""}
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
          disabled={true}
          value={
            itemForm.STOCK_QUANTITY ? itemForm.STOCK_QUANTITY.toString() : ""
          }
          onChange={handleChangeItemForm}
        />
        <TextField
          name="UNIT_VALUE"
          label="Unit value"
          fullWidth
          placeholder="Per piece, accepts decimal digit 10, 2 e.g. 1234567890.12, please do not exceed"
          type="number"
          value={itemForm.UNIT_VALUE ? itemForm.UNIT_VALUE.toString() : ""}
          onChange={handleChangeItemForm}
          onWheel={(e) =>
            e.target instanceof HTMLInputElement && e.target.blur()
          }
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
            label="Acquisition Date"
            onChange={(newDate) =>
              setItemForm((prevForm) => ({
                ...prevForm,
                RECEIVED_AT: newDate ? newDate.toDate() : null,
              }))
            }
          />
        </LocalizationProvider>

        <DefaultTextField
          name="SERIAL_NO"
          label="SERIAL Number"
          value={itemForm.SERIAL_NO}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="PROP_NO"
          label="Property Number(PROP)"
          value={itemForm.PROP_NO}
          onChange={handleChangeItemForm}
        />
        <DefaultTextField
          name="PAR_NO"
          label="Property Acknowledgement Receipt (PAR)"
          value={itemForm.PAR_NO}
          onChange={handleChangeItemForm}
          disabled={capitalOutlay === "down"}
        />
        <DefaultTextField
          name="MR_NO"
          label="Material Requisition (MR)"
          value={itemForm.MR_NO}
          required={false}
          onChange={handleChangeItemForm}
        />

        {/* pis/ ics */}
        <DefaultTextField
          name="PIS_NO"
          label="PIS/ICS Number"
          value={itemForm.PIS_NO}
          onChange={handleChangeItemForm}
          disabled={capitalOutlay === "up"}
        />

        {/**ACcount code should be select auto complete */}
        <div className="flex gap-2 justify-end">
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
        isLoading={isLoading}
      />
    </>
  );
};

export default AddItem;
