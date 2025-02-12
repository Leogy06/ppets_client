"use client";

import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useDeleteEmployeesMutation,
  useEditItemMutation,
  useGetItemsQuery,
} from "@/features/api/apiSlice";
import { ItemProps } from "@/types/global_types";
import { Button, Modal, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  deleteEmployees: () => void;
}

//confirm delete items
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  deleteEmployees,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-[300px] bg-white rounded-2xl flex flex-col items-center justify-center gap-5 p-7 shadow-lg relative">
          <div className="w-full flex flex-col gap-1">
            <p className="text-lg font-bold text-gray-900">
              Delete Employee(s)?
            </p>
            <p className="text-gray-500 font-light">
              Are you sure you want to delete the selected item(s)? This action
              cannot be undone.
            </p>
          </div>
          <div className="w-full flex items-center justify-center gap-2">
            <button
              onClick={onClose}
              className="w-1/2 h-9 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={deleteEmployees}
              className="w-1/2 h-9 rounded-lg bg-red-400 text-white hover:bg-red-500 font-semibold"
            >
              Delete
            </button>
          </div>
          <button
            className="absolute top-5 right-5 flex items-center justify-center bg-transparent hover:text-black"
            onClick={onClose}
          >
            <svg
              height="20px"
              viewBox="0 0 384 512"
              className="fill-gray-400 hover:fill-black"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Inventory = () => {
  const router = useRouter();

  const { openSnackbar } = useSnackbar();
  const {
    data: items,
    isLoading: isItmRdy,
    isError: isErrItm,
  } = useGetItemsQuery();

  //edit items
  const [editItem] = useEditItemMutation();

  //selection row
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [openConfirmDlt, setOpenConfirmDlt] = useState(false);

  //delete items mustation
  const [deleteItems, { isLoading: isDltLdng, isError: isDltErr }] =
    useDeleteEmployeesMutation();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 180, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      type: "number",
      editable: true,
    },
    {
      field: "emp_ownder",
      headerName: "Owner",
      width: 170,
      valueGetter: (params) => (params ? params : "Not owned"),
    },
    { field: "ics", headerName: "ICS#", width: 170, editable: true },
    { field: "are_no", headerName: "ARE#", width: 130, editable: true },
    { field: "prop_no", headerName: "PROP#", width: 120, editable: true },
    {
      field: "unit_value",
      headerName: "Unit Value",
      width: 90,
      type: "number",
      editable: true,
    },
    {
      field: "total_value",
      headerName: "Total Value",
      width: 90,
      type: "number",
      editable: true,
    },
    { field: "status", headerName: "STATUS", width: 75, editable: true },
    {
      field: "category_item",
      headerName: "CATEGORY",
      width: 250,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Added at#",
      width: 150,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : null),
    },
    {
      field: "updatedAt",
      headerName: "Updated at",
      width: 150,
      type: "dateTime",
      valueGetter: (params) => (params ? new Date(params) : null),
    },
  ];

  //handle row edit
  const handleRowEdit = async (newRow: ItemProps) => {
    const { id, ...updatedFields } = newRow;

    try {
      await editItem({ id, data: updatedFields });
      return { ...newRow };
    } catch (error) {
      console.error(error);
      return { ...items?.find((row) => row.id === id) };
    }
  };

  //handle checkbox crows
  const handleSelection = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel as number[]);
  };

  const handleDeleteItems = async () => {
    await deleteItems(selectedRows);
    if (isDltErr) {
      openSnackbar("Unable to delete item(s).", "error");
      return;
    }

    openSnackbar("Item(s) deleted successfully.", "success");
  };

  useEffect(() => {
    if (items) {
      console.log({ items });
    }
  }, [items]);

  if (isItmRdy) {
    return <div className="animate-pulse text-lg">Loading...</div>;
  }

  if (isErrItm) {
    return <div className="text-red-500">Error fetching item...</div>;
  }

  return (
    <>
      <Paper sx={{ width: "100%", height: 400 }}>
        <DataGrid
          columns={columns}
          rows={items}
          processRowUpdate={(newRow) => handleRowEdit(newRow)}
          checkboxSelection
          onRowSelectionModelChange={(rowSelectionModal) =>
            handleSelection(rowSelectionModal as number[])
          }
        />
      </Paper>
      <Button
        variant="contained"
        sx={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem" }}
        onClick={() => router.push("/admin/inventory/add")}
      >
        add item
      </Button>
      <DeleteConfirmModal
        open={openConfirmDlt}
        onClose={() => setOpenConfirmDlt(false)}
        deleteEmployees={handleDeleteItems}
      />
    </>
  );
};

export default Inventory;
