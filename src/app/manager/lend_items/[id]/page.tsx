"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useAddBorrowingTransactionMutation,
  useGetEmployeeByIdQuery,
  useGetItemsByOwnerQuery,
} from "@/features/api/apiSlice";
import { Item } from "@/types/global_types";
import { CheckOutlined } from "@mui/icons-material";
import { Modal, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const LendConfirmation = ({
  open,
  onClose,
  confirm,
}: {
  open: boolean;
  onClose: () => void;
  confirm: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center justify-center">
        <CheckOutlined />
        <p className="text-lg font-semibold text-gray-800">Confirm Items.</p>
        <p className="text-sm text-gray-600 text-center">
          Are you sure to lent these items? <br />.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={confirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Lend
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

const LendEmployee = () => {
  const { id } = useParams(); // id of the employee to borrow
  const { empDetails } = useAuth();
  const { openSnackbar } = useSnackbar();

  const [addBorrowingTransaction] = useAddBorrowingTransactionMutation();

  // fetched manager's own items
  const { data: ownedItems, isLoading: isOwnItmLdng } = useGetItemsByOwnerQuery(
    empDetails?.ID as number
  );

  // the employee that will borrow
  const { data: fetchedEmp, isLoading: isEmpLdng } =
    useGetEmployeeByIdQuery(id);

  const [checkoutItems, setCheckoutItems] = useState<Item[]>([]);

  //checbox selected ids
  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);

  const [openConfirmationLend, setOpenConfirmationLend] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCheckoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Item Name", width: 100 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 75 },
  ];

  const columns2: GridColDef[] = [
    { field: "name", headerName: "Item Name", width: 100 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      renderCell: (params) => {
        const { id, quantity } = params.row;

        const maxQuantity = ownedItems.find(
          (item: Item) => item.id === id
        ).quantity;

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(id, quantity - 1)}
              className="px-2 py-1 bg-gray-200 rounded"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => updateQuantity(id, quantity + 1)}
              className="px-2 py-1 bg-gray-200 rounded"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
        );
      },
    },
  ];

  //handle checkbox
  const handleSelectionChange = (selectIds: GridRowSelectionModel) => {
    setSelectedIds(selectIds);
    const selected = selectIds.map((id) => {
      const existingItem = checkoutItems.find((item) => item.id === id);
      return (
        existingItem || {
          ...ownedItems.find((item: Item) => item.id === id),
          quantity: 1,
          status: 2,
        }
      );
    });

    setCheckoutItems(selected);
  };

  const handleSubmitItems = async () => {
    try {
      console.log({ checkoutItems, borrower: id, owner: empDetails?.ID });
      const result = await addBorrowingTransaction({
        borrowedItems: checkoutItems,
        borrower: id,
        owner: empDetails?.ID,
      }).unwrap();
      openSnackbar(result?.message || "Successfully lend item(s).", "success");
      setCheckoutItems([]); //reset checkout items
      setSelectedIds([]); //reset selected checkboxes
      setOpenConfirmationLend(false); //close modal
    } catch (error) {
      console.error("Unable to add transaction: ", error);
      openSnackbar("Unable to lend items.", "error");
    }
  };

  if (isEmpLdng || isOwnItmLdng) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 overflow-auto max-h-[48rem]">
      <div className="flex items-baseline">
        <BackArrow backTo="/manager/lend_items" />
        <PageHeader pageHead="Lending Items" />
      </div>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          gap: "1rem",
        }}
      >
        <h1>Borrower Details</h1>
        {fetchedEmp ? (
          <div>
            <span>
              Name:{" "}
              {`${fetchedEmp.FIRSTNAME} ${
                fetchedEmp.MIDDLENAME ? fetchedEmp.MIDDLENAME : ""
              } ${fetchedEmp.LASTNAME}`}
            </span>
          </div>
        ) : (
          <div>No employee details found</div>
        )}
        <DataGrid
          columns={columns}
          rows={ownedItems}
          sx={{ height: 400 }}
          isRowSelectable={(params) => params.row.quantity > 0}
          rowSelectionModel={selectedIds}
          checkboxSelection
          onRowSelectionModelChange={(rowSelectionModel) =>
            handleSelectionChange(rowSelectionModel)
          }
        />
      </Paper>
      <Paper
        sx={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1>Checkout</h1>
        <DataGrid
          columns={columns2}
          rows={checkoutItems}
          sx={{ height: 400 }}
        />
        <div className="flex flex-col justify-end">
          {selectedIds.length > 0 && (
            <DefaultButton
              btnIcon={<CheckOutlined />}
              btnText="Lend item(s)"
              onClick={() => setOpenConfirmationLend(true)}
            />
          )}
        </div>
      </Paper>
      <LendConfirmation
        open={openConfirmationLend}
        onClose={() => setOpenConfirmationLend(false)}
        confirm={handleSubmitItems}
      />
    </div>
  );
};

export default LendEmployee;
