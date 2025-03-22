"use client";

import BackArrow from "@/app/(component)/backArrow";
import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import {
  useGetDistributedItemByIdQuery,
  useGetEmployeesQuery,
} from "@/features/api/apiSlice";
import { DistributedItemProps, Employee } from "@/types/global_types";
import { mapEmployees } from "@/utils/arrayUtils";
import { GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const LendItem = () => {
  const { itemId } = useParams();

  const { empDetails } = useAuth();

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

  //handle open modal
  const handleOpenModal = (
    item: DistributedItemProps,
    empDetails: Employee
  ) => {
    setIsConfirmLendModalOpen(true);
    setemployeeDetails(empDetails);
  };
  //handle submit
  const handleSubmit = () => {
    console.log("submited, ", employeeDetails);
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
            onClick={() => handleOpenModal(distributedItemDetails!, params.row)}
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

      <DataTable
        loading={isEmployeesLoading}
        rows={memoisedEmployees || []}
        columns={columns}
        checkboxSelection={false}
        rowLimit={rowLimit}
        setRowLimit={setRowLimit}
      />
      <ConfirmLendModal
        open={isConfirmLendModalOpen}
        onClose={() => setIsConfirmLendModalOpen(false)}
        employeeDetails={employeeDetails}
        distributedItem={distributedItemDetails}
        loading={false}
        handleSubmit={handleSubmit}
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
}: {
  open: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  distributedItem: DistributedItemProps | undefined;
  employeeDetails: Employee | null;
  loading: boolean;
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
        <p className="flex gap-1">
          Available quantity:
          <span className="underline underline-offset-1">
            {distributedItem?.quantity}
          </span>
        </p>
        <div className="flex gap-1 justify-end">
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
