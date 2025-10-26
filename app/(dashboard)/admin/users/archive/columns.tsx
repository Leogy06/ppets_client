import { Employee } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { departmentReader } from "../columns";
import { formatDate } from "@/utils/dateFormatter";
import { Button } from "@/components/ui/button";
import { ArrowUp, Edit } from "lucide-react";

export const archiveEmployeeColumns: ColumnDef<Employee>[] = [
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
    cell: () => {
      return (
        <Button>
          <ArrowUp />
        </Button>
      );
    },
  },
];
