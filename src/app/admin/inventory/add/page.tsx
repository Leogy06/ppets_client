"use client";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddItemMutation,
  useGetItemCategoriesQuery,
} from "@/features/api/apiSlice";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AddItem = () => {
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    ics: "",
    are_no: "",
    prop_no: "",
    serial_no: "",
    value: 0,
    category_item: 0,
  });
  const {
    data: itemCategories,
    isLoading: isItmCatRdy,
    isError: isItmFtchErr,
  } = useGetItemCategoriesQuery({});

  const [addItem, { isLoading: isItemLding, isError }] = useAddItemMutation();

  const router = useRouter();

  const { openSnackbar } = useSnackbar();

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setItemForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await addItem(itemForm);

    if (isError) {
      console.error("Unable to submit item: ", result);
      openSnackbar("Unable to add the item.", "error");
    } else {
      openSnackbar("Item has been added.", "success");
    }
  };

  if (isItmCatRdy) {
    return <div className="text-gray-500 animate-pulse">Loading...</div>;
  }

  if (isItmFtchErr) {
    return <div className="text-red-500">Error fething Item Categories...</div>;
  }
  return (
    <>
      <div className="w-full flex justify-center ">
        <form
          onSubmit={handleSubmitForm}
          className="flex flex-col gap-4 w-full md:w-96"
        >
          <TextField
            name="name"
            label="Item Name"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
          />
          <TextField
            name="description"
            label="Item Description"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
          />
          <TextField
            name="quantity"
            label="Quantity"
            onChange={handleChangeForm}
            disabled={isItemLding}
            type="number"
            required
          />

          <TextField
            name="ics"
            label="ICS"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
          />
          <TextField
            name="are_no"
            label="ARE No"
            placeholder="Optional"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
          />
          <TextField
            name="prop_no"
            label="Property No"
            placeholder="Optional"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
          />
          <TextField
            name="serial_no"
            label="Serial No"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
          />
          <TextField
            name="value"
            label="Value"
            onChange={handleChangeForm}
            disabled={isItemLding}
            type="number"
            required
          />

          <Autocomplete
            disablePortal
            options={itemCategories || []}
            getOptionLabel={(option: { id: number; description: string }) =>
              option.description || ""
            }
            loading={isItmCatRdy}
            loadingText={<CircularProgress size={20} />}
            sx={{ width: "100%" }}
            onChange={(_, newValue) => {
              if (newValue) {
                setItemForm((prevForm) => ({
                  ...prevForm,
                  category_item: (newValue as { id: number }).id,
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Categories"
                variant="filled"
                disabled={isItemLding}
              />
            )}
          />
          <div className="flex gap-2 justify-center md:justify-end">
            <Button
              type="reset"
              onClick={() => router.push("/admin/inventory")}
              disabled={isItemLding}
            >
              cancel
            </Button>
            <Button variant="contained" type="submit" disabled={isItemLding}>
              add
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddItem;
