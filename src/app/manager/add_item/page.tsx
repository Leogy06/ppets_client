"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useAddItemMutation,
  useGetItemCategoriesQuery,
} from "@/features/api/apiSlice";
import { ItemCatProps, ItemProps } from "@/types/global_types";
import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

const AddItem = () => {
  const { data: catItems, isLoading: isCatLdng } = useGetItemCategoriesQuery(
    {}
  );

  const { empDetails, user } = useAuth();

  const [itemForm, setItemForm] = useState<ItemProps>({
    name: "",
    description: "",
    quantity: 0,
    ics_no: "",
    are_no: "",
    unit_value: 0,
    category_item: 0,
    added_by: user?.id || 0,
    accountable_emp: empDetails?.ID || 0,
  });

  const [addItem] = useAddItemMutation();

  const handleChangeItemForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await addItem(itemForm);
      console.log("Item added: ", result);
    } catch (error) {
      console.error("Unable to submit item form: ", error);
    }
  };

  return (
    <>
      <button>
        <></>
      </button>
      <div className="flex justify-center  w-full ">
        <form
          onSubmit={handleSubmitItem}
          className=" flex flex-col gap-4 w-full md:w-96"
        >
          <TextField
            name="name"
            label="Item name"
            onChange={handleChangeItemForm}
            required
          />
          <TextField
            name="description"
            label="Description"
            onChange={handleChangeItemForm}
            required
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            onChange={handleChangeItemForm}
            required
          />

          <TextField
            name="unit_value"
            label="Unit value"
            placeholder="Price per piece"
            type="number"
            required
            onChange={handleChangeItemForm}
          />
          <TextField
            name="ics"
            label="ICS #"
            placeholder="Optional"
            onChange={handleChangeItemForm}
          />
          <TextField
            name="are_no"
            label="ARE #"
            onChange={handleChangeItemForm}
          />
          <TextField
            name="prop_no"
            label="PROP #"
            onChange={handleChangeItemForm}
          />
          <TextField
            name="serial_no"
            label="Serial #"
            onChange={handleChangeItemForm}
          />
          <Autocomplete
            options={catItems || []}
            getOptionLabel={(option: ItemCatProps) => option.description}
            onChange={(_, newValue) =>
              setItemForm((prevForm) => ({
                ...prevForm,
                category_item: newValue ? newValue.id : null,
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Category"
                required
                disabled={isCatLdng}
              />
            )}
          />
          <DefaultButton btnText="Add" type="submit" />
        </form>
      </div>
    </>
  );
};

export default AddItem;
