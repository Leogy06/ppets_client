"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateReturnTransactionMutation,
  useGetBorrowedItemsQuery,
} from "@/features/api/apiSlice";
import { BorrowingTransactionTypes } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";

const ConfirmReturnModal = ({
  open,
  handleClose,
  transactionDetails,
  handleReturnItem,
  loading,
}: {
  open: boolean;
  handleClose: () => void;
  transactionDetails: BorrowingTransactionTypes | null;
  handleReturnItem: () => void;
  loading: boolean;
}) => {
  useEffect(() => {
    if (transactionDetails) {
      console.log("transactionDetails ", transactionDetails);
    }
  }, [transactionDetails]);

  return (
    <DefaultModal open={open} onClose={handleClose}>
      <div className=" p-4 flex flex-col">
        <h1 className="text-lg font-semibold">Confirm Return Items?</h1>
        <p>Are you sure you want to return this item?</p>

        {/* item details */}
        <div className="flex flex-col gap-2 mt-2">
          <p>
            {" "}
            Item:{" "}
            <span className="font-semibold underline underline-offset-1">
              {transactionDetails?.itemDetails?.ITEM_NAME ?? "N/A"}{" "}
            </span>
          </p>
          <p>
            PAR No:{" "}
            <span className="font-semibold underline underline-offset-1 ">
              {transactionDetails?.itemDetails?.PAR_NO ?? "N/A"}
            </span>
          </p>
          <p>
            Return to:{" "}
            <span className="font-semibold underline underline-offset-1 ">
              {`${transactionDetails?.ownerEmp?.FIRSTNAME} ${
                transactionDetails?.ownerEmp.LASTNAME ?? "N/A"
              }
               ${transactionDetails?.ownerEmp?.MIDDLENAME ?? ""} ${
                transactionDetails?.ownerEmp?.SUFFIX ?? ""
              } `}
            </span>
          </p>
          <p>
            Quantity:{" "}
            <span className="font-semibold underline underline-offset-1">
              {transactionDetails?.quantity ?? "N/A"}
            </span>
          </p>
        </div>
        <div className="flex gap-2 justify-end ">
          <DefaultButton
            btnText="cancel"
            variant="text"
            onClick={handleClose}
            disabled={loading}
          />
          <DefaultButton
            btnText="return"
            onClick={handleReturnItem}
            disabled={loading}
          />
        </div>
      </div>
    </DefaultModal>
  );
};

const BorrowedItems = () => {
  const { empDetails } = useAuth();

  const { data: borrowedItems, isLoading: isBorrowedItemsLoading } =
    useGetBorrowedItemsQuery(empDetails?.ID);

  //use snack bar context
  const { openSnackbar } = useSnackbar();

  //use creat return item
  const [createReturn, { isLoading: isReturnLoading }] =
    useCreateReturnTransactionMutation();

  //confirm modal
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  //transaction hook
  const [transactionDetails, setTransactionDetails] =
    useState<BorrowingTransactionTypes | null>(null);

  const handleReturnItem = async () => {
    try {
      const result = await createReturn(transactionDetails).unwrap();
      console.log("result ", result);

      openSnackbar(result?.message ?? "Successfully returned item", "success");
      handleCloseModal();
    } catch (error) {
      console.error("Unable to return item. - ", error);
      const errMsg = handleError(error, "Unable to return item.");
      openSnackbar(errMsg, "error");
    }
  };

  const handleClickReturn = (row: BorrowingTransactionTypes) => {
    setTransactionDetails(row);
    setOpenConfirmModal(true);
  };

  const handleCloseModal = () => {
    setOpenConfirmModal(false);
    setTransactionDetails(null);
  };

  const columns: GridColDef[] = [
    { field: "itemName", headerName: "Item Name", width: 200 },
    { field: "quantity", headerName: "Borrowed Quantity", width: 100 },
    { field: "itemPar", headerName: "PAR No.", width: 100 },
    { field: "itemOwner", headerName: "Item Owner", width: 300 },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <DefaultButton
              btnText="Return"
              onClick={() => handleClickReturn(params.row)}
            />
          </div>
        );
      },
    },
  ];

  //log borrowed items
  // console.log("borrowedItems ", borrowedItems);

  //mapped borrowed items
  const mappedBorrowedItems = useMemo(() => {
    return borrowedItems?.map((transaction: BorrowingTransactionTypes) => ({
      ...transaction,
      id: transaction.id,
      itemName: transaction.itemDetails.ITEM_NAME.toUpperCase(),
      itemPar: transaction.itemDetails.PAR_NO,
      itemOwner: `${transaction.ownerEmp.LASTNAME}, ${
        transaction.ownerEmp.FIRSTNAME
      } ${transaction?.ownerEmp?.MIDDLENAME ?? ""} ${
        transaction?.ownerEmp?.SUFFIX ?? ""
      }`.toUpperCase(),
    }));
  }, [borrowedItems]);

  return (
    <>
      <PageHeader pageHead="Borrowed Items" />
      <DataTable
        rows={mappedBorrowedItems}
        columns={columns}
        loading={isBorrowedItemsLoading}
      />
      <ConfirmReturnModal
        open={openConfirmModal}
        handleClose={handleCloseModal}
        transactionDetails={transactionDetails}
        handleReturnItem={handleReturnItem}
        loading={isReturnLoading}
      />
    </>
  );
};

export default BorrowedItems;
