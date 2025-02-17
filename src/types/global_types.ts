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
<<<<<<< HEAD
  FIRSTNAME: string;
=======
  MIDDLENAME: string;
  SUFFIX: string;
>>>>>>> ad5cca11589a9ad3d1a3572e083fbdcddc9b1c57
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
