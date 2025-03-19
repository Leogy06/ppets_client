"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateTransferTransactionMutation,
  useGetEmployeesQuery,
  useGetItemsByIdQuery,
} from "@/features/api/apiSlice";
import { Employee, Item } from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

//modal for selected employee
const ModalTransfer = ({
  open,
  onClose,
  handleSubmit,
  itemToTransfer,
  employeeDetails,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  itemToTransfer: Item | undefined;
  employeeDetails: Employee | null;
  loading: boolean;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="flex flex-col max-h-[70vh]">
        <h1 className="text-lg font-semibold">Transfer</h1>
        <p className="mb-4 text-sm">
          Are you sure you want to transfer this item?
        </p>
        <p>
          Item:
          <span className="underline underline-offset-1">
            {" "}
            {itemToTransfer?.itemDetails?.ITEM_NAME ?? "Unknown"}
          </span>
        </p>
        <p>
          PAR:{" "}
          <span className="underline underline-offset-1">
            {itemToTransfer?.itemDetails.PAR_NO ?? "Unknown"}
          </span>
        </p>
        <p>
          Quantity:{" "}
          <span className="underline underline-offset-1">
            {itemToTransfer?.quantity}
          </span>
        </p>
        <p>
          Transfer to:{" "}
          <span className=" underline underline-offset-1">
            {employeeDetails?.fullName}
          </span>
        </p>
        <div className="flex gap-1 justify-end">
          <DefaultButton
            btnText="cancel"
            onClick={onClose}
            variant="text"
            color="error"
            disabled={loading}
          />
          <DefaultButton
            btnText="confirm"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </DefaultModal>
  );
};

const TransferItem = () => {
  //param item id
  const { item_id } = useParams();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //user details
  const { empDetails } = useAuth();

  //get employee
  const { data: employess, isLoading: isEmployeesLoading } =
    useGetEmployeesQuery(Number(empDetails?.CURRENT_DPT_ID));

  //get item (distributed)
  const { data: item, isLoading: isItemLoading } = useGetItemsByIdQuery(
    Number(item_id)
  );

  //modal
  const [openModal, setOpenModal] = useState(false);

  //employee selected
  const [employeSelected, setEmployeSelected] = useState<Employee | null>(null);

  //use create transfer transaction
  const [createTransferTransaction, { isLoading: isTransferLoading }] =
    useCreateTransferTransactionMutation();

  //handle open modal
  const handleOpenModal = (empDetails: Employee) => {
    setEmployeSelected(empDetails);
    setOpenModal(true);
  };

  //handle submit
  const handleSubmit = async () => {
    try {
      const result = await createTransferTransaction({
        item_id: item?.id,
        quantityTransferred: item?.quantity,
        newAccountablePerson: employeSelected?.ID,
      }).unwrap();

      console.log("result ", result);

      openSnackbar("Item transferred successfully.", "success");
      setOpenModal(false);
    } catch (error) {
      console.error("Unable to transfer item. ", error);
      const errMsg = handleError(error, "Unable to transfer item.");
      openSnackbar(errMsg, "error");
    }
  };

  //employe column
  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center">
          <DefaultButton
            btnText="select"
            onClick={() => handleOpenModal(params.row)}
          />
        </div>
      ),
    },
    { field: "fullName", headerName: "Name", flex: 1 },
  ];

  //mapped employee
  const mappedEmployee = useMemo(
    () =>
      employess?.map((emp: Employee) => {
        const firstName = emp.FIRSTNAME;
        const lastName = emp.LASTNAME;
        const middleName = emp?.MIDDLENAME ?? "";
        const suffix = emp?.SUFFIX ?? "";
        return {
          ...emp,
          id: emp.ID,
          fullName: `${lastName} ${firstName} ${middleName} ${suffix}`,
        };
      }),
    [employess]
  );

  const ItemDetails = () => (
    <div>
      <h1 className="font-semibold text-lg">Your item</h1>
      <p>Item: {item?.itemDetails?.ITEM_NAME}</p>
      <p>PAR: {item?.itemDetails?.PAR_NO}</p>
      <p>
        Quanity: {item?.quantity} / {item?.ORIGINAL_QUANTITY}
      </p>
    </div>
  );

  if (!item_id) {
    return <p>No item id acquired.</p>;
  }

  return (
    <>
      <div>
        <PageHeader pageHead="Transfer Item" />
        {isItemLoading && <ItemDetails />}
      </div>
      <DataTable
        rows={mappedEmployee || []}
        columns={columns}
        loading={isEmployeesLoading}
      />
      <ModalTransfer
        open={openModal}
        onClose={() => setOpenModal(false)}
        itemToTransfer={item}
        handleSubmit={handleSubmit}
        employeeDetails={employeSelected}
        loading={isTransferLoading}
      />
    </>
  );
};

export default TransferItem;
