export interface ErrorParams {
  response: {
    message: string;
  };
}
//item props
export interface DistributedItemProps {
  id: number;
  accountableEmpDetails: Employee;
  accountable_emp: number;
  acct_code?: string;
  added_by: number | null;
  borrower_emp_id: number | null;
  category_item: number | null;
  DISTRIBUTED_BY: number;
  DISTRIBUTED_ON: Date;
  ITEM_ID: number;
  OWNER_EMP: number | null;
  ORIGINAL_QUANTITY: number;
  pis_no?: string;
  prop_no: string;
  quantity: number;
  remarks?: string;
  serial_no?: string;
  total_value: number;
  undistributedItemDetails: UndistributedItem;
  unit_value: number;
  current_dpt_id: number;
}

export interface ItemCategory {
  id: number;
  description: string;
}

// Define the type for the user
export interface User {
  id: number;
  role: number;
  username: string;
  emp_id: number;
  password: string;
  email: string;
  // Add other user fields if needed
}

export interface Employee {
  fullName: string; // customized
  ID: number;
  ID_NUMBER: number | null;
  DEPARTMENT_ID: number;
  CURRENT_DPT_ID: number;
  FIRSTNAME: string;
  LASTNAME: string;
  MIDDLENAME: string;
  SUFFIX: string;
  CREATED_BY: number | null;
  UPDATED_BY: number | null;
  departmentDetails: Department;
  creator: Employee; // CREATED_BY
  updater: Employee; // UPDATED_BY
  UPDATED_WHEN: Date;
  CREATED_WHEN: Date;
  DELETED: 0 | 1;
}
export interface Credentials {
  username: string;
  password: string;
}

export interface Department {
  ID: number;
  DEPARTMENT_NAME: string;
  CODE: string;
  DESCRIPTION?: string;
  OFFICER: string;
  POSITION: string;
  ENTRY_DATE: Date;
}

export interface TransactionProps {
  id: number | null;
  distributed_item_id: number | null; //undistributed item id
  borrower_emp_id: number | null;
  borrowerEmpDetails: Employee;
  owner_emp_id: number | null;
  ownerEmpDetails: Employee;
  quantity: number | null;
  status: number | null;
  transactionStatusDetails: TransactionStatusProps;
  remarks: number;
  transactionRemarksDetails: TransactionRemarksProps;
  createdAt: Date;
  updatedAt: Date;
  name?: string; //item name, not include in db, but in form
  DPT_ID: number | null;
  distributedItemDetails: DistributedItemProps;
  DISTRIBUTED_ITM_ID: number; // distributed item id
  TRANSACTION_DESCRIPTION: string;
  APPROVED_BY: number;
  owner: string;
  borrower: string;
  borrowedItem: string;
}

export interface TransactionStatusProps {
  id: number;
  description: string;
}

export interface TransactionRemarksProps {
  id: number;
  DESCRIPTION: string;
}

export interface ItemStatus {
  ID: number;
  DESCRIPTION: string;
}

export interface NotificationProps {
  ID: number;
  MESSAGE: string;
  createdAt: Date;
  QUANTITY: number;
  READ: number;
  TRANSACTION: number;
  borrowerEmpDetails: Employee;
  ownerEmpDetails: Employee;
  itemDetails: UndistributedItem;
  REQUEST_STATUS: number;
}

export interface NotificationPropsOther {
  ownerNotification?: NotificationProps;
  adminNotification?: NotificationProps;
  ID?: number;
  MESSAGE?: string;
  READ?: number;
  FOR_EMP?: number;
  TRANSACTION_ID?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UndistributedItem {
  ID: number;
  ITEM_NAME: string;
  DESCRIPTION: string;
  STOCK_QUANTITY: number;
  ORIGINAL_QUANTITY: number;
  UNIT_VALUE: number;
  TOTAL_VALUE: number;
  SERIAL_NO: string;
  ICS_NO: string;
  PIS_NO: string;
  PROP_NO: string;
  REMARKS: string;
  RECEIVED_AT: Date | null;
  PAR_NO: string;
  MR_NO: string;
  ACCOUNT_CODE: number;
  accountCodeDetails: AccountItem;
  DELETE: number;
  DEPARTMENT_ID: number;
  updatedAt: Date;
  createdAt: Date;
  ADDED_BY: number;
}

export interface TransactionRemarksProp {
  ID: number;
  DESCRIPTION: string;
}

export interface AccountItem {
  ID: number;
  ACCOUNT_CODE: string;
  ACCOUNT_TITLE: string;
  DELETED: number;
}
