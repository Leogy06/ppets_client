export interface User {
  id: number;
  role: number;
  username: string;
  password: string;
  is_active: number;
}

export interface Items {
  ID: number;
  ITEM_NAME: string;
  DESCRIPTION: string;
  UNIT_VALUE: number;
  QUANTITY: number;
  originalQuantity: number;
  RECEIVED_AT: string;
  PIS_NO: string;
  PROP_NO: string;
  MR_NO: string;
  ACCOUNT_CODE: number; // account code id FOREIGN KEY
  ADDED_BY: number; // EMPLOYEE ID FOREIGN KEY
  ICS_NO: string;
  SERIAL_NO: string;
  REMARKS: string;
  PAR_NO: string;
  condition: string;
}

export enum Condition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  REPAIR = "REPAIR",
  MAINTENANCE = "MAINTENANCE",
}

export interface AccountCode {
  ID: number;
  ACCOUNT_CODE: string;
  ACCOUNT_TITLE: string;
}

export interface Employee {
  ID: number;
  ID_NUMBER: number;
  FIRSTNAME: string;
  MIDDLENAME?: string;
  LASTNAME: string;
  SUFFIX?: string;
  DEPARTMENT_ID: number;
  CURRENT_DPT_ID: number;
  CREATED_BY: string;
  CREATED_WHEN: string;
  UPDATED_BY: string;
  UPDATED_WHEN: string;
  DELETED: number;
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCEL = "CANCEL",
  REJECTED = "REJECTED",
}

export interface Transaction {
  id: string;
  status: Status;
  employeeId: number;
  itemId: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
  item: Items;
  employee: Employee;
}

export interface Notification {
  id: string;
  message: string;
  read: Read;
}

export enum Read {
  READ = "READ",
  UNREAD = "UNREAD",
}
