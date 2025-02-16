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
  Modal,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
  itemForm: {
    name: string;
    description: string;
    quantity: number;
    ics: string;
    are_no: string;
    prop_no: string;
    serial_no: string;
    value: number;
    category_item: number;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  submit,
  itemForm,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {/* From Uiverse.io by EcheverriaJesus */}
      <div className="flex flex-col bg-white h-96 w-96 rounded-md py-4 px-6 border absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-auto">
        <h3 className="text-center font-bold text-xl text-gray-800 pb-2">
          Item Summary
        </h3>
        <h3 className="text-base font-semibold text-gray-900 flex gap-1">
          <p>Name:</p> {itemForm.name}
        </h3>
        <p className="text-sm text-gray-500 pb-3 flex gap-1">
          <p>Description:</p> {itemForm.description}
        </p>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">Quantity:</p>
          <p>{itemForm.quantity}</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">ICS:</p>
          <p>{itemForm.ics}</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">ARE #:</p>
          <p>{itemForm.are_no}</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">Property #:</p>
          <p>{itemForm.prop_no}</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">Serial #:</p>
          <p>{itemForm.serial_no}</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">Value:</p>
          <p>{itemForm.value}</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500 border-b pb-2">
          <p className="">Category:</p>
          <p>{itemForm.category_item}</p>
        </div>
        <div className="flex justify-center items-center py-3">
          <Button
            variant="contained"
            onClick={() =>
              submit(
                new Event(
                  "submit"
                ) as unknown as React.FormEvent<HTMLFormElement>
              )
            }
            disabled={
              !itemForm.name ||
              !itemForm.description ||
              !itemForm.quantity ||
              !itemForm.serial_no ||
              !itemForm.value ||
              !itemForm.category_item
            }
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

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

  //modal confirmation
  const [openModal, setOpenModal] = useState(false);

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

  //handle modals
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
          className="flex flex-col gap-4 w-full md:w-96 h-[32rem] md:h-[48rem] overflow-auto p-4"
        >
          <TextField
            name="name"
            label="Item Name"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
            fullWidth
          />
          <TextField
            name="description"
            label="Item Description"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
            fullWidth
          />
          <TextField
            name="quantity"
            label="Quantity"
            onChange={handleChangeForm}
            disabled={isItemLding}
            type="number"
            required
            fullWidth
          />

          <TextField
            name="ics"
            label="ICS"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
            fullWidth
          />
          <TextField
            name="are_no"
            label="ARE No"
            placeholder="Optional"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
            fullWidth
          />
          <TextField
            name="prop_no"
            label="Property No"
            placeholder="Optional"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
            fullWidth
          />
          <TextField
            name="serial_no"
            label="Serial No"
            onChange={handleChangeForm}
            disabled={isItemLding}
            required
            fullWidth
          />
          <TextField
            name="value"
            label="Value"
            onChange={handleChangeForm}
            disabled={isItemLding}
            type="number"
            inputProps={{ step: "0.01" }}
            required
            fullWidth
          />

          <TextField //change pani
            name="emp_owner"
            label="Owner"
            onChange={handleChangeForm}
            disabled={isItemLding}
            fullWidth
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
          <div className="flex gap-2 justify-center  md:justify-end">
            <Button
              variant="contained"
              type="button"
              onClick={handleOpenModal}
              disabled={isItemLding}
            >
              checkout
            </Button>
            <Button
              type="reset"
              onClick={() => router.push("/admin/inventory")}
              disabled={isItemLding}
            >
              cancel
            </Button>
          </div>
        </form>
      </div>
      {/*Modal confirmation add*/}
      <ConfirmationModal
        open={openModal}
        onClose={handleCloseModal}
        submit={handleSubmitForm}
        itemForm={itemForm}
      />
    </>
  );
};

export default AddItem;
