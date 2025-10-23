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
  UNIT_VALUE: string;
  STOCK_QUANTITY: number;
  ORIGINAL_QUANTITY: number;
  RECEIVED_AT: string;
  PIS_NO: string;
  PROP_NO: string;
  MR_NO: string;
  ACCOUNT_code: number; // account code id FOREIGN KEY
  ADDED_BY: number; // EMPLOYEE ID FOREIGN KEY
  ICS_NO: number;
}

export enum Condition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  REPAIR = "REPAIR",
}
