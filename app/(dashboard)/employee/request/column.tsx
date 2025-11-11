import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const transactionColumn: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => {
      return row.original.item.ITEM_NAME;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
