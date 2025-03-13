"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useDeleteUndistributedItemMutation,
  useGetUnDistributeItemQuery,
} from "@/features/api/apiSlice";
import { handleError } from "@/utils/errorHandler";
import {
  AddBoxOutlined,
  ArrowDropDownCircle,
  ArrowUpward,
  Cancel,
  Check,
  Delete,
  Inventory2Outlined,
} from "@mui/icons-material";
import { Modal } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ItemId {
  id: number | null;
}

const ConfirmModal = ({
  open,
  onClose,
  handleDeleteItem,
  isLoading,
  itemShow,
}: {
  open: boolean;
  onClose: () => void;
  handleDeleteItem: (param: number) => void;
  isLoading: boolean;
  itemShow: number;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {itemShow === 0 ? (
        <div className="dead-center bg-white w-10/12 rounded-lg border md:w-96 flex flex-col items-center p-4">
          <h1 className="text-lg font-bold mb-8">Confirm Delete Item?</h1>
          <div className="flex flex-col gap-4"></div>
          <div className="flex gap-2 justify-center">
            <DefaultButton
              btnIcon={<Cancel />}
              onClick={onClose}
              title="Abort delete"
              variant="outlined"
              color="error"
              placement="top"
              disabled={isLoading}
            />
            <DefaultButton
              btnIcon={<Check />}
              onClick={() => handleDeleteItem(1)}
              title="Proceed delete item"
              placement="top"
              disabled={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="dead-center bg-white w-10/12 rounded-lg border md:w-96 flex flex-col items-center p-4">
          <h1 className="text-lg font-bold mb-8">Confirm Restore Item?</h1>
          <div className="flex flex-col gap-4"></div>
          <div className="flex gap-2 justify-center">
            <DefaultButton
              btnIcon={<Cancel />}
              onClick={onClose}
              title="Abort restore"
              variant="outlined"
              color="error"
              placement="top"
              disabled={isLoading}
            />
            <DefaultButton
              btnIcon={<Check />}
              onClick={() => handleDeleteItem(0)}
              title="Proceed restore item"
              placement="top"
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

const InventorySelectDropDown = ({
  handleSelect,
  itemShows,
}: {
  handleSelect: (param: number) => void;
  itemShows: number;
}) => {
  const options = [
    { id: 0, label: "Available Items" },
    { id: 1, label: "Deleted Items" },
  ];

  return (
    <div className="absolute z-50 left-auto -right-40 top-4 mt-2 bg-white border border-gray-300 rounded-md shadow-md w-44">
      {options.map((option) => (
        <button
          key={option.id}
          className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 ${
            itemShows === option.id ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => handleSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const Inventory = () => {
  //use hooks
  //router
  const router = useRouter();
  //employee details
  const { empDetails } = useAuth();

  //get undistributed items
  const { data: undistributtedItems, isLoading: isUndistributeLoading } =
    useGetUnDistributeItemQuery(Number(empDetails?.CURRENT_DPT_ID));

  //delete item
  const [deleteItem, { isLoading: isDeleteLoading }] =
    useDeleteUndistributedItemMutation();

  //snackbar
  const { openSnackbar } = useSnackbar();

  //use state hookss
  const [openModal, setOpenModal] = useState(false);

  //itemId
  const [itemId, setItemId] = useState<ItemId["id"]>(null);

  //item row shows
  const [itemShows, setItemShows] = useState<number>(0);

  //open inventory dropdown
  const [isOpen, setIsOpen] = useState(false);

  //item to delete

  //handles
  //open delete modal
  const handleOpenModal = (itemId: ItemId["id"]) => {
    setOpenModal(true);
    setItemId(itemId);
  };

  //close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setItemId(null);
  };

  //handle delete item api
  const handleDeleteItem = async (action: number) => {
    if (!itemId) {
      openSnackbar("Item id is required to proceed.", "info");
      return;
    }

    console.log("action ", action);

    try {
      const result = await deleteItem({ itemId, action }).unwrap();
      openSnackbar(result.message ?? "Item deleted.", "info");
      handleCloseModal();
    } catch (error) {
      console.error("Unable to delete item  unexpected error occured.", error);

      const errMsg = handleError(
        error,
        "Unable to delete item, unexpected error occured."
      );
      openSnackbar(errMsg, "error");
    }
  };

  //data grid column
  const columns: GridColDef[] = [
    { field: "ITEM_NAME", headerName: "Item Name", width: 120 },
    {
      field: "STOCK_QUANTITY",
      headerName: "Remaining",
      type: "number",
      width: 140,
    },
    {
      field: "ORIGINAL_QUANTITY",
      headerName: "Original Quantity",
      type: "number",
      width: 160,
    },

    {
      field: "UNIT_VALUE",
      type: "number",
      headerName: "Unit value",
      width: 110,
    },
    {
      field: "TOTAL_VALUE",
      type: "number",
      headerName: "Total value",
      width: 110,
    },
    { field: "REMARKS", headerName: "Remarks", width: 180 },
    {
      field: "RECEIVED_AT",
      headerName: "Received on",
      width: 180,
      type: "date",
      valueGetter: (params) => new Date(params) ?? "--",
    },
    {
      field: "Actions",
      renderCell: (params) => {
        return itemShows === 0 ? (
          <DefaultButton
            title="Delete Item"
            btnIcon={<Delete />}
            color="error"
            variant="text"
            onClick={() => handleOpenModal(params.row.ID)}
          />
        ) : itemShows === 1 ? (
          <DefaultButton
            title="Restore Item"
            btnIcon={<ArrowUpward />}
            color="success"
            variant="text"
            onClick={() => handleOpenModal(params.row.ID)}
          />
        ) : (
          "Unknown action"
        );
      },
    },
  ];

  //items to show

  const rows = useMemo(
    () =>
      undistributtedItems?.filter((item) => {
        if (itemShows === 0) return item.DELETE !== 1;
        if (itemShows === 1) return item.DELETE !== 0;
        return item.DELETE !== 1;
      }) || [],
    [undistributtedItems, itemShows]
  );

  //inventory dropdown handles
  const handleSelectOption = (option: number) => {
    setItemShows(option);
    setIsOpen(false);
  };

  // useEffect(() => {
  //   if (undistributtedItems) {
  //     console.log("undistrivbute items ", undistributtedItems);
  //   }
  // }, [undistributtedItems]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-start relative">
          <PageHeader pageHead="Inventory" icon={Inventory2Outlined} />
          <button
            className="hover:text-gray-500 "
            onClick={() => setIsOpen((prevState) => !prevState)}
          >
            <ArrowDropDownCircle fontSize="medium" />
          </button>
          {isOpen && (
            <InventorySelectDropDown
              handleSelect={handleSelectOption}
              itemShows={itemShows}
            />
          )}
        </div>
        <DefaultButton
          btnIcon={<AddBoxOutlined />}
          title="Add item"
          onClick={() => router.push("/admin/inventory/add")}
        />
      </div>
      <div className="h-[400px]">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(params) => params.ID}
          loading={isUndistributeLoading}
        />
      </div>
      <ConfirmModal
        open={openModal}
        onClose={handleCloseModal}
        handleDeleteItem={handleDeleteItem}
        isLoading={isDeleteLoading}
        itemShow={itemShows}
      />
    </>
  );
};

export default Inventory;
