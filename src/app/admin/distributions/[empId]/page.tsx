"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddDistributedItemMutation,
  useGetEmployeeByIdQuery,
  useGetUndistributedItemByIdQuery,
  useGetUnDistributeItemQuery,
} from "@/features/api/apiSlice";
import {
  AccountItem,
  DistributedItemProps,
  UndistributedItem,
} from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { CancelOutlined, Check, CompareArrows } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

//this is for distribution of items to employees

//child modal
const ConfirmDistribute = ({
  open,
  onClose,
  handleSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  isLoading: boolean;
}) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      className={`border border-red-700 ${
        isDarkMode ? "bg-black text-gray-50" : " bg-white text-gray-900"
      }`}
    >
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-lg font-semibold">Confirm distribute?</h1>
        <div className="flex gap-1">
          <DefaultButton
            btnText="cancel"
            variant="text"
            color="error"
            onClick={onClose}
            disabled={isLoading}
          />
          <DefaultButton
            btnText="confirm"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );
};

//parent modal
const DistributionModal = ({
  open,
  onClose,
  itemId,
}: {
  open: boolean;
  onClose: () => void;
  itemId: UndistributedItem["ID"];
}) => {
  const { empDetails } = useAuth();

  //accountable emp id from params
  const empId = Number(useParams().empId);

  //use get query
  const { data: itemDetails, isLoading } = useGetUndistributedItemByIdQuery(
    Number(itemId)
  );

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //use darkmode

  // const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  //add item
  const [addItem, { isLoading: isItemAddLoading }] =
    useAddDistributedItemMutation();

  const [itemForm, setItemForm] = useState<Partial<DistributedItemProps>>({
    ITEM_ID: itemDetails?.ID,
    quantity: 0,
    accountable_emp: 0,
    DISTRIBUTED_BY: 0,
    added_by: 0,
    current_dpt_id: 0,
  });

  //for child modal
  const [openChildOpen, setOpenChildOpen] = useState(false);

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("item form ", itemForm);
    setOpenChildOpen(true);
  };

  //submit api item

  const handleSubmitApi = async () => {
    try {
      await addItem(itemForm).unwrap();

      openSnackbar("Item distributed!", "success");

      setOpenChildOpen(false);
      onClose();
    } catch (error) {
      console.error("Unable to submit item. ", error);
      const errMsg = handleError(error, "Unable to submit item.");

      openSnackbar(errMsg, "error");
    }
  };

  //setting item id , accountable emp and distributed
  useEffect(() => {
    if (itemDetails && empId) {
      setItemForm((prevForm) => ({
        ...prevForm,
        ITEM_ID: itemDetails.ID,
        DISTRIBUTED_BY: Number(empDetails?.ID),
        accountable_emp: empId,
        added_by: Number(empDetails?.ID),
        current_dpt_id: Number(empDetails?.CURRENT_DPT_ID),
        unit_value: itemDetails.UNIT_VALUE,
      }));
    }
  }, [itemDetails, empDetails?.ID, empId]);

  // useEffect(() => {
  //   console.log("dark mode: ", isDarkMode);
  // }, [isDarkMode]);

  const SpanItemForm = ({
    formField,
    itemField,
  }: {
    formField: string;
    itemField: string | number;
  }) => (
    <span className="flex gap-2 justify-center items-center">
      <span className="max-w-[50%] text-end">{formField}:</span>
      <p className="font-semibold underline underline-offset-1 max-w-[50%]">
        {itemField}
      </p>
    </span>
  );

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      className={` bg-white text-black`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-h-[70vh] mp-4 overflow-auto"
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold">Finalize the Distribution</h1>
          {itemDetails && !isLoading && (
            <div className="flex flex-col gap-2">
              <SpanItemForm
                formField="Item"
                itemField={itemDetails?.ITEM_NAME ?? "N/A"}
              />
              <SpanItemForm
                formField="Quantity"
                itemField={`${itemDetails.STOCK_QUANTITY}/${itemDetails.ORIGINAL_QUANTITY}`}
              />

              <SpanItemForm
                itemField={itemDetails?.SERIAL_NO ?? "N/A"}
                formField="Serial Number"
              />
              <SpanItemForm
                itemField={itemDetails?.PROP_NO ?? "N/A"}
                formField="Property Number"
              />
              <SpanItemForm
                itemField={itemDetails?.DESCRIPTION ?? "N/A"}
                formField="Description"
              />
              <SpanItemForm
                itemField={itemDetails?.PAR_NO ?? "N/A"}
                formField="Property Acknowledgement Receipt"
              />
              <SpanItemForm
                itemField={itemDetails?.MR_NO ?? "N/A"}
                formField="Material Requisition"
              />
            </div>
          )}
          <DefaultTextField
            name="quantity"
            label="Quantity"
            onChange={handleOnchange}
            type="number"
          />
          <div className="flex justify-end">
            <DefaultButton
              btnText="submit"
              type="submit"
              disabled={isItemAddLoading}
            />
          </div>
        </div>
      </form>
      <ConfirmDistribute
        open={openChildOpen}
        onClose={() => setOpenChildOpen(false)}
        handleSubmit={handleSubmitApi}
        isLoading={isItemAddLoading}
      />
    </DefaultModal>
  );
};

const Distribute = () => {
  //use hooks
  //emp reciever id params
  const empId = Number(useParams().empId);

  //get emp receiver
  const { data: empReceiver, isLoading: isEmpRecLoading } =
    useGetEmployeeByIdQuery(Number(empId));

  //user details
  const { empDetails } = useAuth();

  const { data: undistributedItems, isLoading: isItemsLoading } =
    useGetUnDistributeItemQuery(Number(empDetails?.CURRENT_DPT_ID));

  //use state hooks
  const [isModalOpen, setIsModalOpen] = useState(false);

  //item id
  const [itemId, setItemId] = useState<UndistributedItem["ID"]>(0);

  //handles
  const handleOpenModal = (itemId: UndistributedItem["ID"]) => {
    setItemId(itemId);
    setIsModalOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="flex gap-1 items-center justify-center">
            <DefaultButton
              onClick={() => handleOpenModal(params.row.ID)}
              disabled={params.row.STOCK_QUANTITY <= 0}
              btnIcon={<CompareArrows />}
              title="Distribute this item"
            />
          </div>
        );
      },
    },
    { field: "ITEM_NAME", headerName: "Item name", width: 135 },
    {
      field: "Quantity",
      headerName: "Quantity",
      width: 95,
      renderCell: (params) =>
        `${params.row.STOCK_QUANTITY}/${params.row.ORIGINAL_QUANTITY}`,
    },
    { field: "DESCRIPTION", headerName: "Description", width: 140 },
    {
      field: "UNIT_VALUE",
      headerName: "Unit value",
      width: 180,
      type: "number",
    },
    {
      field: "TOTAL_VALUE",
      headerName: "Total value",
      width: 180,
      type: "number",
    },
    { field: "SERIAL_NO", headerName: "Serial #", width: 135 },
    { field: "PROP_NO", headerName: "Prop #", width: 140 },
    {
      field: "accountCodeDetails",
      headerName: "Account Code",
      width: 200,
      valueGetter: (params: AccountItem) =>
        `${params?.ACCOUNT_CODE ?? ""} - ${params?.ACCOUNT_TITLE ?? ""}`,
    },
  ];

  // console.log("undistributed items: ", undistributedItems);

  return (
    <>
      <PageHeader pageHead="Select an item to distribute" />
      <div className="flex gap-2 mb-4 justify-between">
        <BackArrow backTo="/admin/distributions" />
        <div className="flex gap-2">
          <h1 className="text-base font-semibold">Receiver: </h1>
          {!isEmpRecLoading && empReceiver && (
            <div className="text-base">
              <span className=" underline underline-offset-4">
                {empReceiver.LASTNAME}, {empReceiver.FIRSTNAME}{" "}
                {empReceiver.SUFFIX ?? ""}
                {empReceiver.MIDDLENAME ?? ""}
              </span>
            </div>
          )}
        </div>
      </div>
      <DataTable
        rows={undistributedItems || []}
        columns={columns}
        getRowId={(params) => params.ID}
        loading={isItemsLoading}
        disableRowSelectionOnClick
      />
      <DistributionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={itemId}
      />
    </>
  );
};

export default Distribute;
