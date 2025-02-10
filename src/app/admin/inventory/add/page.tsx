import { TextField } from "@mui/material";
import React from "react";

const AddItem = () => {
  return (
    <>
      <div className="w-full border flex justify-center ">
        <form className="flex flex-col gap-4 w-full md:w-96">
          <TextField name="description" />
          <TextField name="quantity" />
          <TextField name="are_no" />
          <TextField name="prop_no" />
          <TextField name="serial_no" />
          <TextField name="status" />
          <TextField name="value" />
          <TextField name="category_item" />
        </form>
      </div>
    </>
  );
};

export default AddItem;
