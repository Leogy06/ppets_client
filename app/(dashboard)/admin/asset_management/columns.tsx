"use client";

import { Button } from "@/components/ui/button";
import { Condition, Items } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const itemsColumn: ColumnDef<Items>[] = [
  {
    accessorKey: "ITEM_NAME",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <ArrowUpDown className="ml-4 h-4 w-4" />
        </Button>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, value) => {
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      return cellValue.includes(String(value).toLowerCase());
    },
  },
  {
    accessorKey: "UNIT_VALUE",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-4 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("UNIT_VALUE"));

      //format the amount
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return <div className="text-left font-medium">{formattedAmount}</div>;
    },

    //sorting numerically
    sortingFn: (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.getValue(columnId)) || 0;
      const b = parseFloat(rowB.getValue(columnId)) || 0;

      return a - b;
    },
  },
  {
    accessorKey: "QUANTITY",
    header: "Quantity",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      return (
        <span
          className={`
        ${itemConditionTextColor(row.getValue("condition"))}
         tracking-tighter font-semibold`}
        >
          {row.getValue("condition")}
        </span>
      );
    },
  },
];

function itemConditionTextColor(condition: Condition) {
  switch (condition) {
    case "EXCELLENT":
      return "text-green-500";
    case "GOOD":
      return "text-blue-500";
    case "POOR":
      return "text-purple-500";
    case "REPAIR":
      return "text-red-500";
  }
}
