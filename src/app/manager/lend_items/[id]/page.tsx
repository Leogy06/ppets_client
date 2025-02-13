"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import { useAuth } from "@/context/AuthContext";
import {
  useGetEmployeeByIdQuery,
  useGetItemsByOwnerQuery,
} from "@/features/api/apiSlice";
import { CheckOutlined } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

const LendEmployee = () => {
  const { id } = useParams(); // id of the employee to borrow
  const { empDetails } = useAuth();

  // the employee that will borrow
  const {
    data: fetchedEmp,
    isLoading: isEmpLdng,
    isError,
    error,
  } = useGetEmployeeByIdQuery(id);

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  // fetched manager's own items
  const { data: ownedItems = [], isLoading: isOwnItmLdng } =
    useGetItemsByOwnerQuery(empDetails?.ID as number);

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
    const selectedItems = ownedItems.filter((item: { id: number }) =>
      selectIds.includes(item.id)
    );
    setCheckoutItems(selectedItems);
  };

  const handleSubmitItems = async () => {
    try {
      console.log({ checkoutItems });
    } catch (error) {
      console.error(error);
    }
  };

  if (isEmpLdng || isOwnItmLdng) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
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
          checkboxSelection
          onRowSelectionModelChange={(rowSelectionModel) => {
            handleSelectionChange(rowSelectionModel);
          }}
        />
      </Paper>
      <Paper sx={{ padding: "1rem" }}>
        <h1 className="mb-4">Checkout</h1>
        <DataGrid
          columns={columns2}
          rows={checkoutItems}
          sx={{ height: 400, marginBottom: "1rem", alignSelf: "end" }}
        />
        <DefaultButton
          btnIcon={<CheckOutlined />}
          onClick={handleSubmitItems}
        />
      </Paper>
    </div>
  );
};

export default LendEmployee;
