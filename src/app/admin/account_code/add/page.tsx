"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useCreateAccountItemMutation } from "@/features/api/apiSlice";
import { handleError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AddAccountCodeItem = () => {
  //use router
  const router = useRouter();
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

      //clean up the code
      setAccountCodeForm({
        ACCOUNT_CODE: "",
        ACCOUNT_TITLE: "",
      });
      openSnackbar("New Account Code Successfully!", "success");
      handleCloseConfirmCreateAccountCode();

      //go back to account code
      router.back();
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
        <h1 className="font-bold text-base">
          Are you sure you want to add this account code?
        </h1>
        <div className="grid grid-cols-1 gap-1">
          <p>
            Account Code:
            <span className="underline">
              {accountCodeForm?.ACCOUNT_CODE ?? "--"}
            </span>
          </p>
          <p>
            Account Title:
            <span className="underline">
              {accountCodeForm?.ACCOUNT_TITLE ?? "--"}
            </span>
          </p>
        </div>
        <div className="flex justify-end">
          <DefaultButton
            btnText="cancel"
            onClick={handleCloseConfirmCreateAccountCode}
            disabled={isCreateAccountCodeLoading}
            variant="text"
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
      <div className="flex mb-4 items-center gap-1">
        <BackArrow />
        <PageHeader pageHead="Add Account Code" hasMarginBottom={false} />
      </div>
      <form onSubmit={handleOpenConfirm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DefaultTextField
            name="ACCOUNT_CODE"
            label="Account Code"
            onChange={handleOnchange}
            value={accountCodeForm.ACCOUNT_CODE || ""}
          />
          <DefaultTextField
            name="ACCOUNT_TITLE"
            label="Account Title"
            onChange={handleOnchange}
            value={accountCodeForm.ACCOUNT_TITLE || ""}
          />
          <div className="flex justify-end col-span-1 md:col-span-2">
            <DefaultButton btnText="Submit" type="submit" />
          </div>
        </div>
      </form>
      <ConfirmCreateAccountCode />
    </>
  );
};

export default AddAccountCodeItem;
