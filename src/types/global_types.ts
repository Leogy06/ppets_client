export interface ErrorParams {
  response: {
    message: string;
  };
}
//item props
export interface Item {
  id?: number;
  name: string;
  description?: string;
  quantity: number;
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
  ID: number;
  CURRENT_DPT_ID: number | null;
  FIRSTNAME: string;
  LASTNAME: string;
  MIDDLENAME: string;
  SUFFIX: string;
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
  id: number;
  borrowedItem: number;
  borrower: number | null;
  owner: number | null;
  quantity: number | null;
  status: number | null;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string; //item name, not include in db, but in form
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

export interface BorrowingStatusProps {
  id: number;
  description: string;
}

export interface UndistributedItem {
  ID: number;
  ITEM_NAME: string;
  DESCRIPTION: string;
  STOCK_QUANTITY: number;
  UNIT_VALUE: number;
  TOTAL_VALUE: number;
  SERIAL_NO: string;
  PROP_NO: string;
  REMARKS: string;
  DEPARTMENT_ID: number;
  RECIEVED_AT: Date;
  updatedAt: Date;
  createdAt: Date;
}
