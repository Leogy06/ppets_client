"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useDeleteUndistributedItemMutation,
  useGetUndistributedItemCountQuery,
  useGetUnDistributeItemQuery,
  useRestoreUndistributedItemMutation,
} from "@/features/api/apiSlice";
import { AccountItem, UndistributedItem } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import {
  AddBoxOutlined,
  ArrowDropDownCircle,
  Cancel,
  Check,
  Delete,
  Inventory2Outlined,
  Restore,
} from "@mui/icons-material";
import { Modal } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

//confirm restore item
const ConfirmRestoreItemModal = ({
  open,
  onClose,
  handleRestoreItem,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  handleRestoreItem: () => void;
  isLoading: boolean;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="dead-center bg-white w-10/12 rounded-lg border md:w-96 flex flex-col items-center p-4">
        <h1 className="text-lg font-bold mb-8">Confirm Restore Item?</h1>
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
            onClick={handleRestoreItem}
            title="Proceed delete item"
            placement="top"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

//modal for confirm delete items
const ConfirmModal = ({
  open,
  onClose,
  handleDeleteItem,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  handleDeleteItem: () => void;
  isLoading: boolean;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
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
            onClick={handleDeleteItem}
            title="Proceed delete item"
            placement="top"
            disabled={isLoading}
          />
        </div>
      </div>
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

  //item limit undistributed
  const [rowLimit, setRowLimit] = useState(10);

  //get undistributed items
  const { data: undistributtedItems, isLoading: isUndistributeLoading } =
    useGetUnDistributeItemQuery({
      deptID: Number(empDetails?.CURRENT_DPT_ID),
      limit: rowLimit,
    });

  //get undistributed items count
  const { data: undistributedItemsCount } = useGetUndistributedItemCountQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  //delete item
  const [deleteItem, { isLoading: isDeleteLoading }] =
    useDeleteUndistributedItemMutation();

  //restore item
  const [restoreItem, { isLoading: isRestoreItemLoading }] =
    useRestoreUndistributedItemMutation();

  //snackbar
  const { openSnackbar } = useSnackbar();

  //use state hookss

  //modal for delete
  const [openModal, setOpenModal] = useState(false);

  //modal for restore
  const [openRestoreItemModal, setOpenRestoreItemModal] = useState(false);

  //item row shows
  const [itemShows, setItemShows] = useState<number>(0);

  //open inventory dropdown
  const [isOpen, setIsOpen] = useState(false);

  //selected item id to delete
  const [selectedItemId, setSelectedItemId] = useState<number[]>([]);

  //item to delete

  //handles
  //open delete modal
  const handleOpenModal = () => {
    //set open modal
    //open deleted open modal if item shows is not deleted(1)
    setOpenModal(true);
  };

  //handle open restore modal
  const handleOpenRestoreModal = () => {
    setOpenRestoreItemModal(true);
  };

  //close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //handle close restore item modal
  const handleCloseRestoreItemModal = () => {
    setOpenRestoreItemModal(false);
  };

  //handle checkbox select row
  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedItemId(rowSelectionModel as number[]);
  };

  //handle delete item api
  const handleDeleteItem = async () => {
    try {
      const result = await deleteItem(selectedItemId).unwrap();
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

  //handle restore item api
  const handleRestoreItem = async () => {
    try {
      const result = await restoreItem(selectedItemId).unwrap();
      openSnackbar(result.message ?? "Item restored.", "success");

      handleCloseRestoreItemModal();
    } catch (error) {
      console.error("Unable to restore item  unexpected error occured.", error);

      const errMsg = handleError(
        error,
        "Unable to restore item, unexpected error occured."
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
      field: "RECEIVED_AT",
      headerName: "Acquisition Date",
      width: 180,
      type: "date",
      valueGetter: (params) => new Date(params) ?? "--",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      renderCell: (params) => {
        return `${params.row.STOCK_QUANTITY} / ${params.row.ORIGINAL_QUANTITY}`;
      },
      width: 180,
    },

    {
      field: "UNIT_VALUE",
      type: "number",
      headerName: "Unit value in ₱",
      width: 180,
    },
    {
      field: "TOTAL_VALUE",
      type: "number",
      headerName: "Total value in ₱",
      width: 180,
    },
    {
      field: "DESCRIPTION",
      headerName: "Description",
      width: 190,
    },
    {
      field: "PAR_NO",
      headerName: "PAR #",
      width: 180,
    },
    {
      field: "MR_NO",
      headerName: "MR #",
      width: 180,
    },
    {
      field: "PROP_NO",
      headerName: "Property #",
      width: 180,
    },
    {
      field: "accountCodeDetails",
      headerName: "Account Code",
      width: 300,
      valueGetter: (params: AccountItem) =>
        `${params?.ACCOUNT_CODE ?? ""} - ${params?.ACCOUNT_TITLE ?? ""}`,
    },
    { field: "REMARKS", headerName: "Remarks", width: 180 },
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

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-start relative">
          <span className="flex gap-1 items-center">
            <PageHeader
              pageHead="Inventory"
              icon={Inventory2Outlined}
              hasMarginBottom={false}
            />
            <OptionRowLimitCount
              onChange={(limit) => setRowLimit(limit)}
              currentValue={rowLimit}
              className="bg-white"
              totalCount={undistributedItemsCount}
            />
          </span>
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
        <div className="flex gap-1 ">
          {/**Show button delete the item */}
          {selectedItemId.length > 0 && itemShows === 0 && (
            <DefaultButton
              btnIcon={<Delete />}
              onClick={handleOpenModal}
              color="error"
              title="Delete selected item"
              placement="left"
            />
          )}
          {selectedItemId.length > 0 && itemShows === 1 && (
            <DefaultButton
              btnIcon={<Restore />}
              onClick={handleOpenRestoreModal}
              color="success"
              title="Delete selected item"
              placement="left"
            />
          )}
          <DefaultButton
            btnIcon={<AddBoxOutlined />}
            title="Add item"
            placement="top"
            onClick={() => router.push("/admin/inventory/add")}
          />
        </div>
      </div>
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(params: UndistributedItem) => params.ID}
        loading={isUndistributeLoading}
        checkboxSelection
        onRowSelectionModelChange={(rowSelectionModel) =>
          handleSelectionChange(rowSelectionModel)
        }
      />
      {/**delete item modal */}
      <ConfirmModal
        open={openModal}
        onClose={handleCloseModal}
        handleDeleteItem={handleDeleteItem}
        isLoading={isDeleteLoading}
      />

      {/**restore item modal */}
      <ConfirmRestoreItemModal
        isLoading={isRestoreItemLoading}
        open={openRestoreItemModal}
        onClose={handleCloseRestoreItemModal}
        handleRestoreItem={handleRestoreItem}
      />
    </>
  );
};

export default Inventory;
