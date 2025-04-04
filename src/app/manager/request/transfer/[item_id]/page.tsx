"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateTransactionMutation,
  useGetDistributedItemByIdQuery,
  useGetEmployeeCountQuery,
  useGetEmployeesQuery,
  useGetTransactionCountQuery,
} from "@/features/api/apiSlice";
import {
  DistributedItemProps,
  Employee,
  TransactionProps,
} from "@/types/global_types";
import { mapEmployees } from "@/utils/arrayUtils";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const TransferItem = () => {
  //transfer form
  const [transferForm, setTransferForm] = useState<Partial<TransactionProps>>({
    DISTRIBUTED_ITM_ID: 0,
    distributed_item_id: 0,
    borrower_emp_id: 0,
    status: 2, //pending
    DPT_ID: 0,
    remarks: 4, // transfer
    quantity: 1,
    owner_emp_id: 0,
  });
  //use create transfer
  const [createTransfer, { isLoading: isTransferLoading }] =
    useCreateTransactionMutation();
  //use snackbar
  const { openSnackbar } = useSnackbar();
  //navigation router
  const router = useRouter();
  //get item id in parameter
  const { item_id } = useParams();
  const { empDetails } = useAuth();
  //get transactio count
  const { data: transactionCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    remarks: 4, //transfer
  });
  const [rowLimit, setRowLimit] = useState(10);
  const { data: employees, isLoading: isEmployeesLoading } =
    useGetEmployeesQuery({
      departmentId: Number(empDetails?.CURRENT_DPT_ID),
      limit: rowLimit,
    });
  //get employee count
  const { data: employeeCount } = useGetEmployeeCountQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  const { data: distributeItem } = useGetDistributedItemByIdQuery(
    Number(item_id)
  );

  //confirm transfer modal
  const [isConfirmTransferOpen, setIsConfirmTransferOpen] = useState(false);
  //employee details to transfer
  const [empTransfer, setEmpTransfer] = useState<Employee | null>(null);

  const handleOpenConfirmTransfer = (employeeDetails: Employee) => {
    setEmpTransfer(employeeDetails);
    setIsConfirmTransferOpen(true);
    setTransferForm((prevFormData) => ({
      ...prevFormData,
      DISTRIBUTED_ITM_ID: distributeItem?.id ?? 0,
      distributed_item_id: distributeItem?.ITEM_ID ?? 0,
      borrower_emp_id: employeeDetails.ID,
      DPT_ID: empDetails?.CURRENT_DPT_ID ?? 0,
      owner_emp_id: empDetails?.ID ?? 0,
    }));
  };

  const handleCloseConfirmTransfer = () => {
    setIsConfirmTransferOpen(false);
    router.push("/manager");
  };

  const handleSubmitTransfer = async () => {
    try {
      await createTransfer(transferForm).unwrap();
      openSnackbar("Item transfer has requested.", "success");
      handleCloseConfirmTransfer();
    } catch (error) {
      console.error("Unable to transfer item. ", error);
      const errMsg = handleError(error, "Unable to transfer item.");
      openSnackbar(errMsg, "error");
    }
  };

  const mappedEmployees = useMemo(
    () => mapEmployees(employees || []),
    [employees]
  );

  //employees columns
  const employeesColumns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      align: "center",
      width: 50,
    },
    { field: "fullName", headerName: "Name", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center gap-1">
          <DefaultButton
            btnText="select"
            onClick={() => handleOpenConfirmTransfer(params.row)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <BackArrow backTo="/manager" />
        <PageHeader pageHead="Transfer Item" hasMarginBottom={false} />
        <OptionRowLimitCount
          onChange={(limit) => setRowLimit(limit)}
          className="bg-white"
          totalCount={employeeCount}
          currentValue={rowLimit}
        />
      </div>
      <div>
        <h1 className="text-lg font-bold">
          Item Name: {distributeItem?.undistributedItemDetails.ITEM_NAME}
        </h1>
        <h2>Select the employee to transfer the item: </h2>
      </div>
      <DataTable
        columns={employeesColumns}
        rows={mappedEmployees}
        loading={isEmployeesLoading}
      />
      <ConfirmTransferModal
        open={isConfirmTransferOpen}
        onClose={() => setIsConfirmTransferOpen(false)}
        transferItem={handleSubmitTransfer}
        itemDetails={distributeItem}
        empTransfer={empTransfer}
        transferForm={transferForm}
        setTransferForm={setTransferForm}
        loading={isTransferLoading}
      />
    </>
  );
};

const ConfirmTransferModal = ({
  open,
  onClose,
  transferItem,
  itemDetails,
  empTransfer,
  transferForm,
  setTransferForm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  transferItem: () => void;
  itemDetails: DistributedItemProps | undefined;
  empTransfer: Employee | null;
  transferForm: Partial<TransactionProps>;
  setTransferForm: React.Dispatch<
    React.SetStateAction<Partial<TransactionProps>>
  >;
  loading: boolean;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <h1 className="text-lg font-bold">Confirm Transfer?</h1>
      <p>Are you sure you want to transfer this item?</p>

      <div className="my-4">
        <p>Item: {itemDetails?.undistributedItemDetails.ITEM_NAME}</p>
        <p>Receiver: {empTransfer?.fullName}</p>
        <p>Available Quantity: {itemDetails?.quantity}</p>
      </div>

      <DefaultTextField
        name="quantity"
        label="Quantity"
        type="number"
        onChange={(e) =>
          setTransferForm((prevFormData) => ({
            ...prevFormData,
            quantity: Number(e.target.value),
          }))
        }
        value={transferForm.quantity ? String(transferForm.quantity) : ""}
      />

      <div className="flex gap-1 justify-end mt-4">
        <DefaultButton
          disabled={loading}
          btnText="cancel"
          onClick={onClose}
          variant="text"
        />
        <DefaultButton
          disabled={loading}
          btnText="confirm"
          onClick={transferItem}
        />
      </div>
    </DefaultModal>
  );
};

export default TransferItem;
