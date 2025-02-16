"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import PageHeader from "@/app/(component)/pageheader";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useAddCategoryItemMutation } from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AddItemCategory = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [additemCategory] = useAddCategoryItemMutation();
  const { openSnackbar } = useSnackbar();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await additemCategory(description).unwrap();
    console.log(result);

    setDescription("");
    openSnackbar(result.data.message, "success");
  };

  return (
    <>
      <PageHeader pageHead="Add Item Category" />
      <form onSubmit={handleSubmit}>
        <DefaultTextField
          name="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mt-4 flex justify-center md:justify-end gap-1">
          <DefaultButton
            type="reset"
            btnText="cancel"
            onClick={() => router.push("/manager/item_category")}
            variant="text"
          />
          <DefaultButton type="submit" btnText="add" />
        </div>
      </form>
    </>
  );
};

export default AddItemCategory;
