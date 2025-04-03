"use client";

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
  useGetDistributedItemsQuery,
  useGetTransactionCountQuery,
} from "@/features/api/apiSlice";
import {
  DistributedItemProps,
  Employee,
  TransactionProps,
} from "@/types/global_types";
import { mapDistributedItems } from "@/utils/arrayUtils";
import { handleError } from "@/utils/errorHandler";
import { Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

// - /manager/request/borrow_items
const BorrowItem = () => {
  //emp user details
  const { empDetails } = useAuth();

  //get borrow transaciton count
  const { data: borrowTransactionCount } = useGetTransactionCountQuery({
    DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    remarks: 1,
  });

  //router for navigation
  const router = useRouter();

  //set row limit rows
  const [rowLimit, setRowLimit] = useState<number>(10);

  //get items
  const { data: distributedItems, isLoading: isDistributedItemsLoading } =
    useGetDistributedItemsQuery({
      owner_emp_id: Number(empDetails?.ID),
      department: Number(empDetails?.CURRENT_DPT_ID),
      limit: rowLimit,
    });

  //use snackbar
  const { openSnackbar } = useSnackbar();

  //create borrow transaction
  const [createBorrowingTransaction, { isLoading: isCreateBorrowLoading }] =
    useCreateTransactionMutation();

  //create borro trnrsaciton form
  const [createBorrowForm, setCreateBorrowForm] = useState({
    DISTRIBUTED_ITM_ID: 0,
    quantity: 1,
    borrower_emp_id: 0,
    owner_emp_id: 0,
    remarks: 0,
    status: 0,
    DPT_ID: 0,
    distributed_item_id: 0,
  });
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
      distributed_item_id: params.ITEM_ID,
      DISTRIBUTED_ITM_ID: params.id,
      quantity: 1,
      borrower_emp_id: Number(empDetails?.ID),
      owner_emp_id: params.accountable_emp,
      remarks: 1, //borrowing
      status: 2, //pending
      DPT_ID: Number(empDetails?.CURRENT_DPT_ID),
    });
    setOpenBorrowModal(true);
  };

  //handleClose modal
  const handleCloseBorrowModal = () => {
    setOpenBorrowModal(false);
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
      field: "itemMr",
      headerName: "MR",
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
      width: 300,
      renderCell: (params) => (
        <div className="flex justify-center gap-1">
          <DefaultButton
            onClick={() => handleOnClickBorrow(params.row)}
            btnText="select"
            title="Borrow this Item"
            placement="left"
            disabled={
              params.row.accountable_emp_id === empDetails?.ID ||
              params.row.quantity === 0
            }
          />
        </div>
      ),
    },
  ];

  // console.log("distributed items ", distributedItems);

  const mappedDistributeditem = useMemo(
    () => mapDistributedItems(distributedItems?.notOwnedItems || []),
    [distributedItems]
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <PageHeader pageHead="Borrow Items" hasMarginBottom={false} />
          <Tooltip title="Row Limit" placement="bottom">
            <OptionRowLimitCount
              className="bg-white"
              currentValue={rowLimit}
              onChange={(limit) => setRowLimit(limit)}
              totalCount={borrowTransactionCount}
            />
          </Tooltip>
        </div>
        <button
          onClick={() =>
            router.push("/manager/request/borrow_items/transactions")
          }
          className="text-sm font-extralight hover:text-gray-500"
        >
          See requests
        </button>
      </div>
      <DataTable
        columns={columns}
        rows={mappedDistributeditem}
        loading={isDistributedItemsLoading}
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
