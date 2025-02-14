export interface ErrorParams {
  response: {
    message: string;
  };
}
//item props
export interface ItemProps {
  id?: number;
  name: string;
  description?: string;
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
}
