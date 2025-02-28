"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddItemMutation,
  useGetEmployeeByIdQuery,
  useGetUndistributedItemByIdQuery,
  useGetUnDistributeItemQuery,
} from "@/features/api/apiSlice";
import { Employee, Item, UndistributedItem } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { CancelOutlined, Check, CompareArrows } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

//child modal
const ConfirmDistribute = ({
  open,
  onClose,
  handleSubmit,
}: {
  open: boolean;
  onClose: () => void;
  handleSubmit: () => void;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-lg font-semibold">Confirm distribute?</h1>
        <div className="flex gap-1">
          <DefaultButton
            btnIcon={<CancelOutlined />}
            variant="text"
            color="error"
            onClick={onClose}
          />
          <DefaultButton btnIcon={<Check />} onClick={handleSubmit} />
        </div>
      </div>
    </DefaultModal>
  );
};

//parent modal
const DistributionModal = ({
  open,
  onClose,
  receiverId,
  itemId,
}: {
  open: boolean;
  onClose: () => void;
  receiverId: Employee["ID"];
  itemId: UndistributedItem["ID"];
}) => {
  const { empDetails } = useAuth();

  //use get query
  const { data: itemDetails, isLoading } = useGetUndistributedItemByIdQuery(
    Number(itemId)
  );

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //add item
  const [addItem, { isLoading: isItemAddLoading }] = useAddItemMutation();

  const [itemForm, setItemForm] = useState<Partial<Item>>({
    ITEM_ID: itemDetails?.ID,
    quantity: null,
    ics: "",
    are_no: "",
    pis_no: "",
    class_no: "",
    acct_code: "",
    accountable_emp: receiverId,
    remarks: "",
    DISTRIBUTED_BY: empDetails?.ID,
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

    if (!itemForm.quantity || !itemForm.are_no) {
      openSnackbar("Required fields are empty. ", "error");
      return;
    }
    console.log("item form ", itemForm);

    setOpenChildOpen(true);
  };

  //submit api item

  const handleSubmitApi = async () => {
    try {
      const result = await addItem(itemForm).unwrap();

      console.log("result ", result);
    } catch (error) {
      console.error("Unable to submit item. ", error);
      const errMsg = handleError(error, "Unable to submit item.");

      openSnackbar(errMsg, "error");
    }
  };

  useEffect(() => {
    if (itemDetails) {
      console.log("item details ", itemDetails);
    } else {
      console.log("no items found");
    }
  }, [itemDetails]);

  return (
    <DefaultModal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold">Finalize the Distribution</h1>

          {itemDetails && !isLoading && (
            <div className="flex flex-col gap-4">
              <span className="flex gap-1 items-center">
                Item |{" "}
                <p className="text-base font-medium">
                  {itemDetails?.ITEM_NAME}
                </p>
              </span>
              <span className="flex gap-1 items-center">
                Quantity |{" "}
                <p className="text-base font-medium">
                  {itemDetails?.STOCK_QUANTITY}
                </p>
              </span>
              <span className="flex gap-1 items-center">
                Unit Value |{" "}
                <p className="text-base font-medium">
                  {itemDetails?.UNIT_VALUE}
                </p>
              </span>
              <span className="flex gap-1 items-center">
                SRN # |{" "}
                <p className="text-base font-medium">
                  {itemDetails?.SERIAL_NO}
                </p>
              </span>
              <span className="flex gap-1 items-center">
                PROP # |{" "}
                <p className="text-base font-medium">{itemDetails?.PROP_NO}</p>
              </span>
            </div>
          )}

          <DefaultTextField
            name="quantity"
            label="Quantity"
            onChange={handleOnchange}
            type="number"
          />
          <DefaultTextField
            name="ics"
            label="ICS #"
            onChange={handleOnchange}
            required={false}
            placeholder="Optional"
          />
          <DefaultTextField
            name="are_no"
            label="ARE #"
            onChange={handleOnchange}
            required
          />
          <DefaultTextField
            name="pis_no"
            label="PIS #"
            onChange={handleOnchange}
            required={false}
            placeholder="Optional"
          />
          <DefaultTextField
            name="class_no"
            label="Class #"
            onChange={handleOnchange}
            required={false}
            placeholder="Optional"
          />
          <DefaultTextField
            name="acc_code"
            label="Account Code"
            onChange={handleOnchange}
            required={false}
            placeholder="Optional"
          />
          <DefaultTextField
            name="remarks"
            label="Remarks"
            onChange={handleOnchange}
            required={false}
            placeholder="Optional"
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
  const [itemId, setItemId] = useState<UndistributedItem["ID"]>(null);

  //handles
  const handleOpenModal = (itemId: UndistributedItem["ID"]) => {
    setItemId(itemId);
    setIsModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "ITEM_NAME", headerName: "Item name", width: 135 },
    {
      field: "Quantity",
      headerName: "Quantity",
      width: 95,
      renderCell: (params) =>
        `${params.row.STOCK_QUANTITY}/${params.row.ORIGINAL_STOCK}`,
    },
    { field: "DESCRIPTION", headerName: "Description", width: 140 },
    { field: "UNIT_VALUE", headerName: "Unit value", width: 95 },
    { field: "TOTAL_VALUE", headerName: "Total value", width: 95 },
    { field: "SERIAL_NO", headerName: "Serial #", width: 135 },
    { field: "PROP_NO", headerName: "Prop #", width: 140 },
    {
      field: "Actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="flex gap-1">
            <Tooltip
              placement="left"
              title={<span className="text-base">Distribute this item</span>}
            >
              <button
                className="hover:text-gray-300"
                onClick={() => handleOpenModal(params.row.ID)}
              >
                <CompareArrows fontSize="large" />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-[400px]">
      <PageHeader pageHead="Select an item to distribute" />
      <div className="flex gap-2 mb-2">
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
      <DataGrid
        rows={undistributedItems}
        columns={columns}
        getRowId={(params) => params.ID}
        loading={isItemsLoading}
      />
      <DistributionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={itemId}
        receiverId={empId}
      />
    </div>
  );
};

export default Distribute;
