"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useCreateAccountItemMutation } from "@/features/api/apiSlice";
import { handleError } from "@/utils/errorHandler";
import React, { useState } from "react";

const AddAccountCodeItem = () => {
  //use snackbar
  const { openSnackbar } = useSnackbar();
  //use rtk
  const [createAccountCode, { isLoading: isCreateAccountCodeLoading }] =
    useCreateAccountItemMutation();

  //use states
  const [accountCodeForm, setAccountCodeForm] = useState({
    ACCOUNT_CODE: "",
    ACCOUNT_TITLE: "",
  });
  const [confirmCreateAccountCode, setConfirmCreateAccountCode] =
    useState(false);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAccountCodeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleOpenConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOpenConfirmCreateAccountCode();
  };

  //handle submit
  const handleSubmit = async () => {
    try {
      await createAccountCode(accountCodeForm).unwrap();

      openSnackbar("New Account Code Successfully!", "success");
    } catch (error) {
      const errMsg = handleError(
        error,
        "Unable to submit entered account code."
      );
      openSnackbar(errMsg, "error");
    }
  };

  const handleCloseConfirmCreateAccountCode = () => {
    setConfirmCreateAccountCode(false);
  };
  const handleOpenConfirmCreateAccountCode = () => {
    setConfirmCreateAccountCode(true);
  };

  //components
  const ConfirmCreateAccountCode = () => {
    return (
      <DefaultModal open={confirmCreateAccountCode}>
        <h1>Are you sure you want to add this account code?</h1>
        <p className="grid grid-cols-1 gap-4">
          <span>Account Title: {accountCodeForm?.ACCOUNT_TITLE ?? "--"}</span>
          <span>Account Code: {accountCodeForm?.ACCOUNT_CODE ?? "--"}</span>
        </p>
        <div className="flex justify-end">
          <DefaultButton
            btnText="cancel"
            onClick={handleCloseConfirmCreateAccountCode}
            disabled={isCreateAccountCodeLoading}
          />
          <DefaultButton
            btnText="confirm"
            onClick={handleSubmit}
            disabled={isCreateAccountCodeLoading}
          />
        </div>
      </DefaultModal>
    );
  };

  return (
    <>
      <PageHeader pageHead="Add Account Code" />
      <form onSubmit={handleOpenConfirm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DefaultTextField
            name="ACCOUNT_CODE"
            label="Account Code"
            type="number"
            onChange={handleOnchange}
          />
          <DefaultTextField
            name="ACCOUNT_TITLE"
            label="Accoun Title"
            onChange={handleOnchange}
          />
          <DefaultButton btnText="Submit" type="submit" />
        </div>
      </form>
      <ConfirmCreateAccountCode />
    </>
  );
};

export default AddAccountCodeItem;
