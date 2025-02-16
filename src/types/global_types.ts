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
<<<<<<< HEAD
  quantity: number;
  ics?: string;
  are_no: string;
  prop_no: string;
  serial_no?: string;
  pis_no?: string;
  class_no?: string;
  acct_code?: string;
  unit_value: number;
  accountable_emp: number | null;
  remarks?: string;
  added_by: number | null;
  category_item: number | null;
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
  CURRENT_DPT_ID: number;
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
=======
  quantity: number | null;
  ics_no?: string;
  are_no: string;
  serial_no?: string;
  unit_value?: number;
  category_item: number | null;
  added_by: number | null;
  accountable_emp: number | null;
}

export interface ItemCatProps {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
>>>>>>> ee03bfbf193bc5b3785b5f8435b49137bc6dab22
}
