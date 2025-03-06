export interface ErrorParams {
  response: {
    message: string;
  };
}
//item props
export interface Item {
  id?: number;
  ITEM_ID: number | null;
  name: string;
  description?: string;
  quantity: number | null;
  ics?: string;
  are_no: string;
  prop_no: string;
  serial_no?: string;
  pis_no?: string;
  class_no?: string;
  acct_code?: string;
  unit_value: number;
  accountable_emp?: number | null;
  remarks?: string;
  added_by: number | null;
  category_item: number | null;
  OWNER_EMP: number | null;
  DISTRIBUTED_BY: number;
  DISTRIBUTED_ON: Date;
  itemDetails: UndistributedItem;
  total_value: number;
  ORIGINAL_QUANTITY: number;
  accountableEmpDetails: Employee;
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
  // Add other user fields if needed
}

export interface Employee {
  ID: number | null;
  ID_NUMBER: number;
  DEPARTMENT_ID: number;
  CURRENT_DPT_ID: number;
  FIRSTNAME: string;
  LASTNAME: string;
  MIDDLENAME: string;
  SUFFIX: string;
  CREATED_BY: number;
  UPDATED_BY: number;
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

export interface BorrowingTransactionTypes {
  id: number | null;
  borrowedItem: number;
  borrower: number | null;
  owner: number | null;
  quantity: number | null;
  status: number | null;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string; //item name, not include in db, but in form
  DPT_ID: number | null;
  itemDetails: UndistributedItem;
}

export interface StatusProcess {
  id: number;
  description: string;
}

export interface ItemStatus {
  ID: number;
  DESCRIPTION: string;
}

export interface NotificationProps {
  ID: number;
  MESSAGE: string;
  createdAt: Date;
  READ: number;
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

export interface BorrowingStatusProps {
  id: number;
  description: string;
}

export interface UndistributedItem {
  ID: number | null;
  ITEM_NAME: string;
  DESCRIPTION: string;
  STOCK_QUANTITY: number;
  UNIT_VALUE: number;
  TOTAL_VALUE: number;
  SERIAL_NO: string;
  PIC_NO: string;
  PROP_NO: string;
  REMARKS: string;
  DELETE: number;
  DEPARTMENT_ID: number;
  RECEIVED_AT: Date | null;
  updatedAt: Date;
  createdAt: Date;
}
