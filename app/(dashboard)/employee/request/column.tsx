import {
  ItemConditionColor,
  StatusColor,
} from "@/app/(components)/common/status-color";
import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const transactionColumn: ColumnDef<Transaction>[] = [
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => {
      return row.original.item.ITEM_NAME;
    },
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusColor status={row.getValue("status")} />,
  },
  {
    accessorKey: "item",
    header: "Item condition",
    cell: ({ row }) => (
      <ItemConditionColor condition={row.original.item.condition} />
    ),
  },
];
