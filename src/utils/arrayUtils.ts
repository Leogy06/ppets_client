import { DistributedItemProps, TransactionProps } from "@/types/global_types";

//distributed item array mapper
export const mapDistributedItems = (items: DistributedItemProps[]) => {
  return items.map((item: DistributedItemProps, index: number) => {
    //destructure item details in items

    //destructure undistributed item
    const { ITEM_NAME, PAR_NO } = item.undistributedItemDetails;
    //destructure accountable employee
    const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
      item.accountableEmpDetails;

    return {
      ...item,
      id: item.id,
      index,
      itemName: ITEM_NAME,
      itemPar: PAR_NO,
      quantity: item.quantity,
      accountableEmp: `${FIRSTNAME} ${MIDDLENAME ?? ""} ${LASTNAME} ${
        SUFFIX ?? ""
      }`,
    };
  });
};

//for transaction array mapper
export const mapTransactions = (transactions: TransactionProps[]) => {
  return transactions.map((transaction: TransactionProps, index: number) => {
    const { DISTRIBUTED_ITM_ID, TRANSACTION_DESCRIPTION } = transaction;

    //undistributed item
    const { ITEM_NAME, PAR_NO, MR_NO } =
      transaction.distributedItemDetails.undistributedItemDetails;

    return {
      ...transaction,
      id: transaction.id,
      index: index + 1,
      borrowedItem: `${ITEM_NAME} (${PAR_NO} - ${MR_NO})`,
      transactionDescription: TRANSACTION_DESCRIPTION,
    };
  });
};
