"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DataTable from "@/app/(component)/datagrid";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import {
  useCreateBorrowingTransactionMutation,
  useGetItemsNotOwnedQuery,
} from "@/features/api/apiSlice";
import {
  DistributedItemProps,
  Employee,
  TransactionProps,
} from "@/types/global_types";
import { mapDistributedItems } from "@/utils/arrayUtils";
import { handleError } from "@/utils/errorHandler";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

// - /manager/request/borrow_items
const BorrowItem = () => {
  //emp user details
  const { empDetails } = useAuth();

  //get items
  const { data: items, isLoading: isItemLoading } = useGetItemsNotOwnedQuery({
    empId: Number(empDetails?.ID),
    departmentId: Number(empDetails?.CURRENT_DPT_ID),
  });

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //create borrow transaction
  const [createBorrowingTransaction, { isLoading: isCreateBorrowLoading }] =
    useCreateBorrowingTransactionMutation();

  //create borro trnrsaciton form
  const [createBorrowForm, setCreateBorrowForm] =
    useState<Partial<TransactionProps> | null>(null);
  //confirm borrow item modal
  const [openBorrowModal, setOpenBorrowModal] = useState(false);
  //accountable employee
  const [accountableEmp, setAccountableEmp] = useState<Employee | null>(null);
  const [itemDetails, setItemDetails] = useState<DistributedItemProps | null>(
    null
  );

  const handleOnClickBorrow = (params: DistributedItemProps) => {
    setAccountableEmp(params.accountableEmpDetails); // accountable of distributed item
    setItemDetails(params); //distributed ite self
    setCreateBorrowForm({
      ...params,
      DISTRIBUTED_ITM_ID: params.id,
      quantity: 1,
      borrower_emp_id: empDetails?.ID,
      owner_emp_id: params.accountable_emp,
    });
    setOpenBorrowModal(true);
  };

  //handleClose modal
  const handleCloseBorrowModal = () => {
    setOpenBorrowModal(false);
    setCreateBorrowForm(null);
  };

  //handle quantity change
  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateBorrowForm((prevForm) => ({
      ...prevForm,
      quantity: Number(e.target.value),
    }));

    // console.log("createBorrowForm ", createBorrowForm);
  };

  const handleSubmitBorrow = async () => {
    try {
      await createBorrowingTransaction(createBorrowForm).unwrap();
      // console.log("result ", result);
      openSnackbar("Successfully created a request to borrow item.", "success");
      handleCloseBorrowModal();
    } catch (error) {
      console.error("Unable to create borrow Transaction. ", error);
      const errMsg = handleError(error, "Unable to create borrow Transaction.");
      openSnackbar(errMsg, "error");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 100,
      valueGetter: (params) => params + 1,
    },
    {
      field: "itemName",
      headerName: "Item",
      width: 200,
    },
    {
      field: "itemPar",
      headerName: "PAR",
      width: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
    },
    {
      field: "accountableEmp",
      headerName: "Accountable Employee",
      width: 260,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-center gap-1">
          <DefaultButton
            onClick={() => handleOnClickBorrow(params.row)}
            btnText="select"
            title="Borrow this Item"
            placement="left"
          />
        </div>
      ),
    },
  ];

  const mappedDistributeditem = useMemo(
    () => mapDistributedItems(items || []),
    [items]
  );

  return (
    <>
      <PageHeader pageHead="Borrow Items" />
      <DataTable
        columns={columns}
        rows={mappedDistributeditem}
        loading={isItemLoading}
      />
      <ConfirmBorrowItemModal
        open={openBorrowModal}
        onClose={handleCloseBorrowModal}
        itemDetails={itemDetails}
        ownerEmpDetails={accountableEmp}
        handleSubmitBorrow={handleSubmitBorrow}
        onChangeQuantity={onQuantityChange}
        loading={isCreateBorrowLoading}
        createBorrowForm={createBorrowForm}
      />
    </>
  );
};

//confirm borrow item modal
const ConfirmBorrowItemModal = ({
  open,
  onClose,
  itemDetails,
  ownerEmpDetails,
  handleSubmitBorrow,
  loading,
  onChangeQuantity,
  createBorrowForm,
}: {
  open: boolean;
  onClose: () => void;
  itemDetails: DistributedItemProps | null;
  ownerEmpDetails: Employee | null;
  handleSubmitBorrow: () => void;
  loading: boolean;
  onChangeQuantity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  createBorrowForm: Partial<TransactionProps> | null;
}) => {
  // useEffect(() => {
  //   if (itemDetails) {
  //     console.log("item details ", itemDetails);
  //   } else {
  //     console.log("no item details");
  //   }
  // }, [itemDetails]);

  return (
    <DefaultModal open={open} onClose={onClose}>
      <h1 className="text-lg font-semibold">Borrow Item</h1>
      <p className="mb-4">Are you sure you want to borrow this item?</p>
      <div className="flex flex-col mb-4 gap-1">
        <p>Item: {itemDetails?.undistributedItemDetails.ITEM_NAME}</p>

        <p>PAR: {itemDetails?.undistributedItemDetails.PAR_NO}</p>
        <p className="mb-4">
          Owner:{" "}
          {`${ownerEmpDetails?.LASTNAME}, ${ownerEmpDetails?.FIRSTNAME} ${
            ownerEmpDetails?.MIDDLENAME ?? ""
          } ${ownerEmpDetails?.SUFFIX ?? ""} `}
        </p>
        <DefaultTextField
          label="Quantity"
          name="quantity"
          onChange={onChangeQuantity}
          value={
            createBorrowForm?.quantity ? String(createBorrowForm.quantity) : ""
          }
        />
      </div>

      <div className="flex gap-1 justify-end">
        <DefaultButton
          btnText="cancel"
          variant="text"
          color="error"
          onClick={onClose}
          disabled={loading}
        />
        <DefaultButton
          btnText="confirm"
          onClick={handleSubmitBorrow}
          disabled={loading}
        />
      </div>
    </DefaultModal>
  );
};

export default BorrowItem;
