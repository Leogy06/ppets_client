"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddItemMutation,
  useCheckUserQuery,
  useGetItemCategoriesQuery,
} from "@/features/api/apiSlice";
import { ArrowBack } from "@mui/icons-material";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const Distribute = () => {
  const { id } = useParams();
  const router = useRouter();

  //check user authenticate
  //for item form value added_by
  const { data: checkUserData } = useCheckUserQuery({});

  const { data: itemCategories, isLoading: isCatItmLdng } =
    useGetItemCategoriesQuery({});

  //add item
  const [addItem, { isLoading: isAddItmLdng }] = useAddItemMutation();

  //snackbar
  const { openSnackbar } = useSnackbar();

  //admin id

  //item form
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    ics: "",
    are_no: "",
    prop_no: "",
    serial_no: "",
    pis_no: "",
    class_no: "",
    acc_code: "",
    unit_value: 0,
    accountable_emp: id, // Should be selected from options
    category_item: 0,
    added_by: checkUserData.id, // Should come from session
  });

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addItem(itemForm).unwrap();

      openSnackbar("Successfully distribute the item.", "success");
    } catch (error) {
      console.error({ error });
      openSnackbar(
        `${
          (error as { data?: { message?: string } }).data?.message ||
          "Unable to distribute item."
        }`,
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
        <button
          className="hover:bg-gray-100 p-4 rounded-full"
          onClick={() => router.push("/admin/distributions")}
        >
          <ArrowBack />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 flex-col w-full md:w-96 h-[42rem] overflow-auto"
      >
        <TextField
          label="Name"
          name="name"
          required
          onChange={handleChangeForm}
        />
        <TextField
          label="Description"
          name="description"
          required
          onChange={handleChangeForm}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          required
          onChange={handleChangeForm}
        />
        <TextField
          label="ICS"
          name="ics"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="ARE No"
          name="are_no"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="Property No"
          name="prop_no"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="Serial No"
          name="serial_no"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="PIS No"
          name="pis_no"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="Class No"
          name="class_no"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="Account Code"
          name="acc_code"
          placeholder="Optional"
          onChange={handleChangeForm}
        />
        <TextField
          label="Unit Value"
          name="unit_value"
          placeholder="Price per quantity"
          type="number"
          required
          onChange={handleChangeForm}
        />
        {/*Get params for accountable emp */}
        {/*total value: unit value * qty */}
        <Autocomplete
          options={itemCategories || []}
          getOptionLabel={(option: { description: string }) =>
            option.description || ""
          }
          onChange={(
            _,
            newValue: { id: number; description: string } | null
          ) => {
            if (newValue && newValue.id) {
              setItemForm((prevForm) => ({
                ...prevForm,
                category_item: newValue.id,
              }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Item Category" variant="outlined" />
          )}
          loading={isCatItmLdng}
          loadingText={<CircularProgress size={20} />}
        />
        <div className="flex gap-4 justify-center md:justify-end">
          <DefaultButton
            btnText="Distribute"
            type="submit"
            disabled={isAddItmLdng}
          />
          <DefaultButton
            btnText="Cancel"
            type="reset"
            variant="text"
            onClick={() => router.push("/admin/distribute")}
          />
        </div>
        {/**Added by should comming from session */}
      </form>
    </div>
  );
};

export default Distribute;
