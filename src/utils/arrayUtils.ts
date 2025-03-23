import {
  DistributedItemProps,
  Employee,
  TransactionProps,
} from "@/types/global_types";
import { dateFormmater } from "./date_formmater";

//distributed item array mapper
export const mapDistributedItems = (
  items: DistributedItemProps[] | undefined
) => {
  // console.log("item from map ", items);

  return (
    items?.map((item: DistributedItemProps, index: number) => {
      //destructure item details in items

      //destructure undistributed item
      const { ITEM_NAME, PAR_NO, MR_NO } = item.undistributedItemDetails;
      //destructure accountable employee
      const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
        item.accountableEmpDetails;
      // console.log("item ", item);

      return {
        ...item,
        id: item.id,
        index: index + 1,
        itemName: ITEM_NAME,
        itemPar: PAR_NO,
        itemMr: MR_NO,
        quantity: item.quantity,
        originalQuantity: item.ORIGINAL_QUANTITY,
        accountableEmp: `${FIRSTNAME} ${MIDDLENAME ?? ""} ${LASTNAME} ${
          SUFFIX ?? ""
        }`,
      };
    }) || []
  );
};

//for transaction array mapper
export const mapTransactions = (
  transactions: TransactionProps[] | undefined
) => {
  return transactions?.map((transaction: TransactionProps, index: number) => {
    // console.log("transaction ", transaction);

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
      transactionDescription: description.toUpperCase(),
      remarksDescription: DESCRIPTION,
    };
  });
};

export const mapEmployees = (employees: Employee[] | undefined) => {
  return employees?.map((employee: Employee, index: number) => {
    const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } = employee; //name
    // console.log("employee ", employee);

    // Ensures creator is always an object
    const {
      FIRSTNAME: CREATOR_FIRSTNAME,
      LASTNAME: CREATOR_LASTNAME,
      MIDDLENAME: CREATOR_MIDDLENAME,
      SUFFIX: CREATOR_SUFFIX,
    } = employee?.creator ?? {};

    // console.log("Employee ", employee.ID_NUMBER, employee.creator);

    //updater
    const {
      FIRSTNAME: UPDATER_FIRSTNAME,
      LASTNAME: UPDATER_LASTNAME,
      MIDDLENAME: UPDATER_MIDDLENAME,
      SUFFIX: UPDATER_SUFFIX,
    } = employee?.updater ?? {};

    return {
      ...employee,
      ID: employee.ID, //dont remove this
      id: employee.ID,
      idNumber: employee.ID_NUMBER,
      index: index + 1,
      fullName: FIRSTNAME
        ? `${FIRSTNAME} ${MIDDLENAME ?? ""} ${LASTNAME} ${SUFFIX ?? ""}`.trim()
        : "N/A",
      department: employee.departmentDetails.DEPARTMENT_NAME,
      creator: CREATOR_FIRSTNAME
        ? `${CREATOR_LASTNAME} ${CREATOR_FIRSTNAME} ${
            CREATOR_MIDDLENAME ?? ""
          } ${CREATOR_SUFFIX ?? ""}`.trim()
        : "",
      createdWhen: dateFormmater(employee?.CREATED_WHEN, "YYYY-MM-DD"),
      updater: UPDATER_FIRSTNAME
        ? `${UPDATER_LASTNAME} ${UPDATER_FIRSTNAME} ${
            UPDATER_MIDDLENAME ?? ""
          } ${UPDATER_SUFFIX ?? ""}`.trim()
        : "",

      updatedWhen: dateFormmater(employee?.UPDATED_WHEN, "YYYY-MM-DD"),
    };
  });
};
