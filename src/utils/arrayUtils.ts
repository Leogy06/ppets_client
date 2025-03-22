import { DistributedItemProps, TransactionProps } from "@/types/global_types";

//distributed item array mapper
export const mapDistributedItems = (items: DistributedItemProps[]) => {
  return items.map((item: DistributedItemProps, index: number) => {
    //destructure item details in items

    //destructure undistributed item
    const { ITEM_NAME, PAR_NO, MR_NO } = item.undistributedItemDetails;
    //destructure accountable employee
    const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
      item.accountableEmpDetails;

    return {
      ...item,
      id: item.id,
      index,
      itemName: ITEM_NAME,
      itemPar: PAR_NO,
      itemMr: MR_NO,
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
    //undistributed item
    const { ITEM_NAME, PAR_NO, MR_NO } =
      transaction?.distributedItemDetails?.undistributedItemDetails || {};

    //borrower item employee
    const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
      transaction?.borrowerEmpDetails || {};

    //owner item employee
    const {
      FIRSTNAME: OWNER_FIRSTNAME,
      LASTNAME: OWNER_LASTNAME,
      MIDDLENAME: OWNER_MIDDLENAME,
      SUFFIX: OWNER_SUFFIX,
    } = transaction?.ownerEmpDetails || {};

    //transaction status
    const { description } = transaction.transactionStatusDetails;

    //remarks
    const { DESCRIPTION } = transaction.transactionRemarksDetails;

    return {
      ...transaction,
      id: transaction.id,
      index: index + 1,
      borrowedItem: ITEM_NAME
        ? `${ITEM_NAME} - (${PAR_NO ?? "N/A"} - ${MR_NO ?? "N/A"})`
        : "N/A",
      quantity: transaction.quantity,
      borrower: FIRSTNAME
        ? `${LASTNAME}, ${FIRSTNAME ?? ""} ${MIDDLENAME} ${SUFFIX ?? ""}`
        : "N/A",
      owner: OWNER_FIRSTNAME
        ? `${OWNER_LASTNAME}, ${OWNER_FIRSTNAME} ${OWNER_MIDDLENAME ?? ""} ${
            OWNER_SUFFIX ?? ""
          }`
        : "N/A",
      transaction: description.toUpperCase(),
      remarks: DESCRIPTION,
    };
  });
};
