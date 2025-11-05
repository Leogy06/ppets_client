import { miniSerializeError } from "@reduxjs/toolkit";
import { Employee, User } from ".";

export type LoginResponseDto = {
  message: string;
  user: User;
  employee: Employee;
};

export type GetitemDto = {
  pageIndex?: number;
  pageSize?: number;
  itemName?: string;
};

export type InputLoginDto = {
  username: string;
  password: string;
};

export type CreateItemDto = {
  ID?: number;
  ITEM_NAME: string;
  DESCRIPTION: string;
  UNIT_VALUE: number;
  QUANTITY: number;
  // TOTAL_VALUE: number | null;
  // STOCK_QUANTITY: number;
  RECEIVED_AT: string; // or Date, depending on how you handle it
  PIS_NO: string;
  PROP_NO: string;
  SERIAL_NO: string;
  ICS_NO: string;
  // DEPARTMENT_ID: number;
  REMARKS: string | null;
  // DELETE: number;
  PAR_NO: string | null;
  MR_NO: string;
  ACCOUNT_CODE: number;

  DELETE?: number;
  // ADDED_BY: number;
  // createdAt: string; // or Date
  // updatedAt: string; // or Date
};

export interface CreateEmployeeDto extends Partial<Employee> {
  ID_NUMBER: number | null;
}

export interface UpdateEmployeeDto extends Partial<Employee> {}

export interface ZodErrorResponse {
  data: {
    errors: { message: string }[];
  };
}

export interface ErrorResponse {
  data: {
    message: string;
  };
}
