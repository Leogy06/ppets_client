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
  quantity: number;
  ics?: number;
  serial_no?: Date;
  value?: number;
  category_item: number;
}
