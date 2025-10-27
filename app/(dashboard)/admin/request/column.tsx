import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const requestColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
];
