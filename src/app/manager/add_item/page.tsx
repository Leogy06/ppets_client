"use client";
<<<<<<< HEAD
import BackArrow from "@/app/(component)/backArrow";
=======

>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useAddItemMutation,
  useGetItemCategoriesQuery,
} from "@/features/api/apiSlice";
<<<<<<< HEAD
import { Item, ItemCategory } from "@/types/global_types";
import { CheckOutlined } from "@mui/icons-material";
import { Autocomplete, Modal, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ConfirmAddItem = ({
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
      <div className="flex flex-col items-center gap-4 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4">
        <CheckOutlined />
        <p className="text-lg font-semibold text-gray-800">
          Confirm add Items.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={confirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AddItem = () => {
  const { empDetails, user } = useAuth();
  const [addItem] = useAddItemMutation();
  //router
  const router = useRouter();
  //item category
  const { data: catItems, isLoading: isCatItmLdng } = useGetItemCategoriesQuery(
    {}
  );
  const [itemForm, setItemForm] = useState<Item>({
    name: "",
    quantity: 0,
    description: "",
    ics: "",
    serial_no: "",
    category_item: 0,
    unit_value: 0,
    accountable_emp: empDetails?.ID as number,
    added_by: user?.id as number,
    are_no: "", // Add missing properties
    prop_no: "",
    pis_no: "",
    class_no: "",
    acct_code: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
=======
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
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
    setItemForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

<<<<<<< HEAD
  const handleSubmitItem = async () => {
    try {
      const result = await addItem(itemForm).unwrap();
      console.log("result: ", result);
    } catch (error) {
      console.error("Unable to add item. ", error);
=======
  const handleSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await addItem(itemForm);
      console.log("Item added: ", result);
    } catch (error) {
      console.error("Unable to submit item form: ", error);
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
    }
  };

  return (
    <>
<<<<<<< HEAD
      <div className="mb-4">
        <PageHeader pageHead="Add item" />
        <BackArrow backTo="/manager" />
      </div>
      <div className="flex w-full justify-center ">
        <form
          onSubmit={handleSubmitItem}
          className="flex flex-col gap-4 h-[38rem] md:h-[48rem] overflow-auto w-full md:w-[48rem]"
        >
          <TextField
            label="Item Name"
            name="name"
            value={itemForm.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={itemForm.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={itemForm.quantity}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="ICS"
            name="ics"
            value={itemForm.ics}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="ARE No."
            name="are_no"
            value={itemForm.are_no}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Property No."
            name="prop_no"
            value={itemForm.prop_no}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="PIS No."
            name="pis_no"
            value={itemForm.pis_no}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Class No."
            name="class_no"
            value={itemForm.class_no}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Account Code"
            name="acct_code"
            value={itemForm.acct_code}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Serial No."
            name="serial_no"
            value={itemForm.serial_no}
            onChange={handleChange}
            fullWidth
          />
          <Autocomplete
            options={catItems}
            loading={isCatItmLdng}
            getOptionLabel={(option: ItemCategory) => option.description || ""}
            onChange={(_, newValue) => {
              if (newValue) {
                setItemForm((prevForm) => ({
                  ...prevForm,
                  category_item: newValue.id,
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category Item"
                value={itemForm.category_item}
                fullWidth
                required
              />
            )}
          />
          <TextField
            label="Unit Value"
            name="unit_value"
            type="number"
            value={itemForm.unit_value}
            onChange={handleChange}
            fullWidth
            required
          />
          <div className="flex gap-4 justify-center md:justify-end mt-4">
            <DefaultButton
              onClick={() => router.push("/manager")}
              variant="text"
              btnText="cancel"
            />
            <DefaultButton onClick={() => setOpenModal(true)} btnText="add" />
          </div>{" "}
        </form>
      </div>
      <ConfirmAddItem
        open={openModal}
        onClose={() => setOpenModal(false)}
        confirm={handleSubmitItem}
      />
=======
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
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
    </>
  );
};

export default AddItem;
