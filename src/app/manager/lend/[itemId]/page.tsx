"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateLendTransactionMutation,
  useGetEmployeesQuery,
  useGetItemsByIdQuery,
  useGetUndistributedItemByIdQuery,
} from "@/features/api/apiSlice";
import {
  BorrowingTransactionTypes,
  Department,
  Employee,
} from "@/types/global_types";
import { handleError } from "@/utils/errorHandler";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

//lend modal
const LendModal = ({
  open,
  onClose,
  handleSubmit,
  onChange,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}) => {
  //use get darkmode state

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  //confirm lend modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  //also close child modal when parent modal is close
  useEffect(() => {
    if (!open) {
      setIsModalOpen(false);
    }
  }, [open]);

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      className={`${
        isDarkMode ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <div className="flex flex-col gap-4 w-full ">
        <h1 className="font-semibold text-lg text-center">Finalized Lend</h1>
        <form
          onSubmit={handleOpenModal}
          className="flex flex-col gap-4 w-full "
        >
          <DefaultTextField
            name="quantity"
            label="Quantity"
            type="number"
            placeholder="Input the quantity of the item to lend"
            onChange={onChange}
          />
          <DefaultTextField
            name="remarks"
            label="Remarks"
            placeholder="Lend remarks?"
            onChange={onChange}
          />
          <div className="flex gap-1 justify-end">
            <DefaultButton
              btnText="cancel"
              variant="text"
              color="secondary"
              onClick={onClose}
            />
            <DefaultButton btnText="lend" type="submit" />
          </div>
        </form>
      </div>

      {/**Confirm lend modal */}
      <DefaultModal
        className={`${
          isDarkMode ? "bg-white text-black" : "bg-black text-white"
        }`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-center font-semibold text-lg">Confirm Lend?</h1>
          <div className="flex gap-1">
            <DefaultButton
              btnText="cancel"
              variant="text"
              color="secondary"
              onClick={() => setIsModalOpen(false)}
            />
            <DefaultButton
              btnText="confirm"
              disabled={loading}
              onClick={handleSubmit}
              title="The item lend will need an approval from the Property Custodian"
            />
          </div>
        </div>
      </DefaultModal>
    </DefaultModal>
  );
};

const LendItem = () => {
  const { itemId } = useParams();

  //get user emp details
  const { empDetails } = useAuth();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //use get employees
  const { data: employees, isLoading: isEmpLoading } = useGetEmployeesQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  //use get item details (distributed)
  const { data: itemDetails } = useGetItemsByIdQuery(Number(itemId));

  //get undistributed item by id
  const { data: undistributedItemDetails } = useGetUndistributedItemByIdQuery(
    Number(itemDetails?.ITEM_ID)
  );

  //open modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  //create lend transaction
  const [createLendTransaction, { isLoading: isLendLoading }] =
    useCreateLendTransactionMutation();

  //use state
  const [lendForm, setLendForm] = useState<Partial<BorrowingTransactionTypes>>({
    distributed_item_id: Number(undistributedItemDetails?.ID),
    borrower_emp_id: null,
    owner_emp_id: empDetails?.ID,
    quantity: 1,
    DPT_ID: empDetails?.CURRENT_DPT_ID,
    remarks: "",
  });

  const handleOpenModal = (empId: number) => {
    setLendForm((prevForm) => ({ ...prevForm, borrower_emp_id: empId }));
    setIsModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Name", width: 200 },
    {
      field: "departmentDetails",
      headerName: "Department",
      width: 180,
      valueGetter: (params: Department) => params.DEPARTMENT_NAME,
    },
    {
      field: "Actions",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <div>
            <DefaultButton
              btnText="select"
              title="Lend this employee"
              onClick={() => handleOpenModal(params.row.ID)}
              disabled={params.row.ID === empDetails?.ID}
            />
          </div>
        );
      },
    },
  ];

  //submit api
  const handleSubmit = async () => {
    try {
      console.log("Lend form ", lendForm);

      const result = await createLendTransaction(lendForm).unwrap();

      console.log("result lend ", result);

      openSnackbar("Lend item was submitted. ", "success");
      setIsModalOpen(false);
    } catch (error) {
      console.error("unexpected error occured. ", error);
      const errMsg = handleError(error, "Unexpected error occurred.");
      openSnackbar(errMsg, "error");
    }
  };

  //handle lend form change
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setLendForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  //   useEffect(() => {
  //     if (employees) {
  //       console.log("employees ", employees);
  //     }
  //   }, [employees]);

  // useEffect(() => {
  //   if (undistributedItemDetails) {
  //     console.log("undistributed item: ", undistributedItemDetails);
  //   }
  // }, [undistributedItemDetails]);

  // useEffect(() => {
  //   if (undistributedItemDetails) {
  //     setLendForm((prevForm) => ({
  //       ...prevForm,
  //       distributed_item_id: Number(undistributedItemDetails.ID), //set borrowed item
  //     }));
  //   }
  // }, [itemDetails]);

  return (
    <div className="flex flex-col">
      <PageHeader pageHead="Select Employee to lend" />
      <div className="flex justify-between items-start mb-4">
        <BackArrow backTo="/manager" />
        {itemDetails && (
          <div className="flex flex-col items-end">
            <h2 className="font-semibold text-lg">Item Details</h2>
            <p>
              Name |{" "}
              <span className="font-medium text-base">
                {itemDetails.itemDetails.ITEM_NAME}
              </span>
            </p>
            <p>
              Quantity |{" "}
              <span className="font-medium text-base">
                <span className="text-green-700">{itemDetails.quantity}</span> /{" "}
                {itemDetails.ORIGINAL_QUANTITY}
              </span>
            </p>
            <p>
              Prop # |{" "}
              <span className="font-medium text-base">
                {itemDetails.itemDetails.PROP_NO}
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="h-[480px]">
        <DataGrid
          rows={employees?.map((emp: Employee) => ({
            ...emp,
            fullName: `${emp.LASTNAME}, ${emp.FIRSTNAME} ${
              emp.MIDDLENAME ?? ""
            } ${emp.SUFFIX ?? ""}`,
          }))}
          getRowId={(params) => params.ID}
          columns={columns}
          loading={isEmpLoading}
        />
      </div>
      <LendModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSubmit}
        onChange={handleChangeForm}
        loading={isLendLoading}
      />
    </div>
  );
};

export default LendItem;
