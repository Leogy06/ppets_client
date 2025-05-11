"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultTextField from "@/app/(component)/defaultTextField";
import FloatingAdd from "@/app/(component)/FloatingAdd";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useEditAccountCodeMutation,
  useGetAccountItemQuery,
} from "@/features/api/apiSlice";
import { AccountItem } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AccountCode = () => {
  // * use router
  const router = useRouter();
  // * use snackbar
  const { openSnackbar } = useSnackbar();
  const { data: accountCodesData, isLoading: isAccountCodeLoading } =
    useGetAccountItemQuery();
  //edit account code
  const [editAccountCode, { isLoading: isAccountCodeEditLoading }] =
    useEditAccountCodeMutation();

  //use states
  //open edit account code
  const [isEditOpenAccountCode, setIsEditOpenAccountCode] = useState(false);
  const [toEditAccountCode, setToEditAccountCode] = useState({
    ACCOUNT_TITLE: "",
    ACCOUNT_CODE: "",
    ID: 0,
    DELETED: 0,
  });
  //see deleted/active account code
  const [accountCodeStatus, setAccountCodeStatus] = useState(0);

  //handle
  //handle edit account code
  const handleEditAccountCode = async () => {
    try {
      await editAccountCode(toEditAccountCode).unwrap();
      openSnackbar("Account code edited successfully", "success");
    } catch (error) {
      const errMsg = handleError(error, "Unable to edit account code");
      openSnackbar(errMsg, "error");
    }
  };

  //handle delete account code
  const handleDeleteAccountCode = async (accountCodeDetails: AccountItem) => {
    try {
      await editAccountCode({
        ...accountCodeDetails,
        DELETED: accountCodeStatus === 1 ? 0 : 1,
      }).unwrap();
      openSnackbar(
        `Account Code ${
          accountCodeStatus === 1 ? "Restored" : "Deleted"
        } successfully.`,
        "info"
      );
    } catch (error) {
      const errMsg = handleError(error, "Unable to delete account code.");
      openSnackbar(errMsg, "error");
    }
  };

  //table columns
  const columns: GridColDef[] = [
    { field: "index", headerName: "#", width: 100 },
    {
      field: "ACCOUNT_CODE",
      headerName: "Account Code",
      width: 180,
    },
    {
      field: "ACCOUNT_TITLE",
      headerName: "Account Title",
      flex: 200,
    },
    {
      field: "actions",
      headerName: "Action",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex justify-center gap-1">
            {/* delete button */}
            <DefaultButton
              btnText={accountCodeStatus === 1 ? "Restore" : "Delete"}
              color={accountCodeStatus === 1 ? "success" : "error"}
              onClick={() => handleDeleteAccountCode(params.row)}
              disabled={isAccountCodeEditLoading}
            />

            {/* edit button */}
            <DefaultButton
              btnText="edit"
              disabled={isAccountCodeEditLoading}
              onClick={() => {
                setIsEditOpenAccountCode(true);
                setToEditAccountCode((prevForm) => ({
                  ...prevForm,
                  ID: params.row.ID,
                  ACCOUNT_CODE: params.row.ACCOUNT_CODE,
                  ACCOUNT_TITLE: params.row.ACCOUNT_TITLE,
                }));
              }}
            />
          </div>
        );
      },
      width: 200,
    },
  ];

  //prefetch add account code
  useEffect(() => {
    router.prefetch("/admin/account_code/add");
  }, [router]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <PageHeader pageHead="Manage Account Code" hasMarginBottom={false} />

        <button
          onClick={() => {
            if (accountCodeStatus === 0) {
              setAccountCodeStatus(1);
              return;
            }
            if (accountCodeStatus === 1) {
              setAccountCodeStatus(0);
              return;
            }
          }}
          className="hover:underline"
        >
          {accountCodeStatus === 0
            ? "See DELETED account codes"
            : "See ACTIVE account codes"}
        </button>
      </div>
      <DataTable
        rows={
          accountCodesData
            ?.filter((code) => code.DELETED === accountCodeStatus)
            .map((code, index) => ({
              ...code,
              index,
            })) || []
        } // * account code rows
        loading={isAccountCodeLoading}
        columns={columns}
        getRowId={(params) => params.ID}
      />
      <FloatingAdd
        toolTipTitle="Add Account Code"
        onClick={() => router.push("/admin/account_code/add")}
      />

      {/* edit account code  */}
      <DefaultModal open={isEditOpenAccountCode}>
        <h1>Edit Account Code</h1>
        <DefaultTextField
          name="ACCOUNT_TITLE"
          label="ACCOUNT_TITLE"
          value={toEditAccountCode.ACCOUNT_TITLE || ""}
          onChange={(e) =>
            setToEditAccountCode((prevForm) => ({
              ...prevForm,
              ACCOUNT_TITLE: e.target.value,
            }))
          }
        />
        <DefaultTextField
          name="ACCOUNT_CODE"
          label="ACCOUNT_CODE"
          value={toEditAccountCode.ACCOUNT_CODE || ""}
          onChange={(e) =>
            setToEditAccountCode((prevForm) => ({
              ...prevForm,
              ACCOUNT_CODE: e.target.value,
            }))
          }
        />
        <div className="flex justify-end">
          <DefaultButton
            btnText="cancel"
            onClick={() => setIsEditOpenAccountCode(false)}
            disabled={isAccountCodeEditLoading}
            variant="text"
          />
          <DefaultButton
            btnText="save"
            onClick={handleEditAccountCode}
            disabled={isAccountCodeEditLoading}
          />
        </div>
      </DefaultModal>
    </>
  );
};

export default AccountCode;
