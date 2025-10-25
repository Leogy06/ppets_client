"use client";

import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import { formatDate } from "@/utils/dateFormatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "LASTNAME",
    header: "Name",
    cell: ({ row }) => {
      return `${row.getValue("LASTNAME")}, ${row.original.FIRSTNAME} ${
        row.original.MIDDLENAME ?? ""
      } ${row.original.SUFFIX ?? ""}`.trim();
    },
  },
  {
    accessorKey: "CURRENT_DPT_ID",
    header: "Department",
    cell: ({ row }) => {
      return departmentReader(row.getValue("CURRENT_DPT_ID"));
    },
  },
  {
    accessorKey: "UPDATED_WHEN",
    header: "Last update",
    cell: ({ row }) => {
      return formatDate(row.getValue("UPDATED_WHEN")) ?? "--";
    },
  },
  {
    accessorKey: "#",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <Button variant={"ghost"}>
            <Edit />
          </Button>
          <Button variant={"ghost"}>
            <Trash />
          </Button>
        </div>
      );
    },
  },
];

function departmentReader(dptId: number) {
  switch (dptId) {
    case 1:
      return "City Accountant's Office";

    default:
      return "Unknown Department";
  }
}
