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
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const LendItem = () => {
  const { itemId } = useParams();

  const { empDetails } = useAuth();
  //get transaciton count
  const { data: lendTransactionCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    remarks: 2,
  });

  //snack bar
  const { openSnackbar } = useSnackbar();

  //row limit
  const [rowLimit, setRowLimit] = useState(10);

  const { data: distributedItemDetails, isLoading: isDistributedItemLoading } =
    useGetDistributedItemByIdQuery(Number(itemId));

  //destructure distibuted item
  const { ITEM_NAME, PAR_NO, MR_NO } =
    distributedItemDetails?.undistributedItemDetails || {};

  //get employees
  const { data: employees, isLoading: isEmployeesLoading } =
    useGetEmployeesQuery({
      departmentId: Number(empDetails?.CURRENT_DPT_ID),
      limit: rowLimit,
    });

  //modal confirm lend
  const [isConfirmLendModalOpen, setIsConfirmLendModalOpen] = useState(false);
  //employee details
  const [employeeDetails, setemployeeDetails] = useState<Employee | null>(null);

  //use create lend transaction
  const [createLendTransaction, { isLoading: isCreateLendLoading }] =
    useCreateTransactionMutation();
  const [createLendTransactionForm, setCreateLendTransactionForm] = useState<
    Partial<TransactionProps>
  >({
    DISTRIBUTED_ITM_ID: 0,
    distributed_item_id: 0,
    borrower_emp_id: 0,
    owner_emp_id: empDetails?.ID,
    status: 2, // lending
    quantity: 0,
    DPT_ID: empDetails?.CURRENT_DPT_ID,
    remarks: 2, //lending
  });

  //handle open modal
  const handleOpenModal = (
    borrowerDetails: Employee //borrower
  ) => {
    setIsConfirmLendModalOpen(true);
    setemployeeDetails(borrowerDetails);
    setCreateLendTransactionForm((prev) => ({
      ...prev,
      DISTRIBUTED_ITM_ID: distributedItemDetails?.id,
      distributed_item_id: distributedItemDetails?.ITEM_ID,
      borrower_emp_id: borrowerDetails.ID,
      quantity: 1,
    }));
  };

  //handle close modal
  const handleCloseModal = () => {
    setIsConfirmLendModalOpen(false);
  };

  //handle submit
  const handleSubmit = async () => {
    try {
      await createLendTransaction(createLendTransactionForm).unwrap();
      openSnackbar("Transaction created successfully.", "success");
      handleCloseModal();
    } catch (error) {
      console.error("Unable to create lend Transaction. ", error);
      const errMsg = handleError(error, "Unable to create lend Transaction.");
      openSnackbar(errMsg, "error");
    }
  };

  //handle change form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateLendTransactionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const memoisedEmployees = useMemo(() => mapEmployees(employees), [employees]);

  //columnn
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    { field: "fullName", headerName: "Name", width: 230 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center">
          <DefaultButton
            btnText="select"
            onClick={() => handleOpenModal(params.row)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center mb-4 gap-2">
        <BackArrow backTo="/manager" />
        <PageHeader pageHead="Lend your Item?" hasMarginBottom={false} />
        <OptionRowLimitCount
          onChange={(limit) => setRowLimit(limit)}
          className="bg-white"
          totalCount={lendTransactionCount}
          currentValue={rowLimit}
        />
      </div>
      {!isDistributedItemLoading && (
        <div className="flex gap-2 justify-center mb-4">
          <div className="flex flex-col items-end">
            <h1>Item:</h1>
            <p>PAR: </p>
            <p>MR: </p>
            <p>Availabel Quantity:</p>
          </div>
          <div className="underline items-start underline-offset-4">
            <p>{ITEM_NAME}</p>
            <p>{PAR_NO}</p>
            <p>{MR_NO}</p>
            <p>{distributedItemDetails?.quantity}</p>
          </div>
        </div>
      )}
      <h1>Select Borrower:</h1>
      <DataTable
        loading={isEmployeesLoading}
        rows={memoisedEmployees || []}
        columns={columns}
        checkboxSelection={false}
        getRowId={(row) => row.ID}
      />
      <ConfirmLendModal
        open={isConfirmLendModalOpen}
        onClose={() => setIsConfirmLendModalOpen(false)}
        employeeDetails={employeeDetails}
        distributedItem={distributedItemDetails}
        loading={isCreateLendLoading}
        handleSubmit={handleSubmit}
        createForm={createLendTransactionForm}
        onChange={handleFormChange}
      />
    </>
  );
};

const ConfirmLendModal = ({
  open,
  onClose,
  handleSubmit,
  distributedItem,
  employeeDetails,
  loading,
  createForm,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  distributedItem: DistributedItemProps | undefined;
  employeeDetails: Employee | null;
  loading: boolean;
  createForm: Partial<TransactionProps>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="flex flex-col max-h-[70vh]">
        <h1 className="text-lg font-semibold">Lend</h1>
        <p className="mb-4 text-sm">Are you sure you want to lend this item?</p>
        <p className="flex gap-1">
          Item:
          <span className="underline underline-offset-1">
            {distributedItem?.undistributedItemDetails?.ITEM_NAME ?? "Unknown"}
          </span>
        </p>
        <p className="flex gap-1">
          Employee:
          <span className="underline underline-offset-1">
            {employeeDetails?.fullName ?? "Unknown"}
          </span>
        </p>
        <p className="flex gap-1 mb-4">
          Available quantity:
          <span className="underline underline-offset-1">
            {distributedItem?.quantity}
          </span>
        </p>
        <DefaultTextField
          name="quantity"
          label="Quantity"
          type="number"
          onChange={onChange}
          value={createForm?.quantity ? String(createForm?.quantity) : ""}
        />
        <div className="flex gap-1 justify-end mt-4">
          <DefaultButton
            btnText="cancel"
            onClick={onClose}
            variant="text"
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

export default LendItem;
