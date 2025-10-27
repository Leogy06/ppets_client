import { Employee, Status, Transaction } from "@/types";
import { formatDate } from "@/utils/dateFormatter";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, Clock, OctagonX } from "lucide-react";

export const requestColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "#",
    header: "Details",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2">
          <h3 className="text--lg font-bold leading-tight">
            {row.original.item.ITEM_NAME}
          </h3>
          <div className="flex flex-col">
            <h4 className="text-muted-foreground">Requested by</h4>
            <p className="text-sm">{employeeName(row.original.employee)}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-muted-foreground">Reason</h4>
            <p>{row.original.reason}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Request Date",
    cell: ({ row }) => {
      return formatDate(row.original.updatedAt);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusComp status={row.original.status} />,
  },
];

function StatusComp({ status }: { status: Status }) {
  switch (status) {
    case "PENDING":
      return (
        <div className="flex gap-2 text-blue-500 items-center text-xs">
          <Clock size={16} />
          Pending
        </div>
      );
    case "APPROVED":
      return (
        <div className="flex gap-2 text-green-500 items-center text-xs">
          <CircleCheckBig />
          Approved
        </div>
      );

    case "CANCEL":
      return (
        <div className="flex gap-2 text-red-500 items-center text-xs">
          <OctagonX />
          Cancel
        </div>
      );

    default:
      return (
        <div className="flex gap-2 text-muted-foreground items-center text-xs">
          Unknown Status
        </div>
      );
  }
}

function employeeName(employee: Employee) {
  return `${employee.LASTNAME}, ${employee.FIRSTNAME} ${
    employee.MIDDLENAME ?? ""
  } ${employee.SUFFIX ?? ""}`;
}
