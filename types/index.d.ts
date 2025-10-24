export interface User {
  id: number;
  role: number;
  username: string;
  password: string;
}

export interface Items {
  ID: number;
  ITEM_NAME: string;
  DESCRIPTION: string;
  UNIT_VALUE: number;
  QUANTITY: number;
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
  condition:string
}

export enum Condition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  REPAIR = "REPAIR",
}
