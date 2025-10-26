import { Employee } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { departmentReader } from "../columns";
import { formatDate } from "@/utils/dateFormatter";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/app/(components)/page-header";
import { useRestoreEmployeeMutation } from "@/lib/api/employeeApi";
import { useState } from "react";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";
import { toast } from "sonner";
import { ErrorResponse, ZodErrorResponse } from "@/types/dto";

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
    cell: ({ row }) => {
      return <ConfirmRestore employeeId={row.original.ID} />;
    },
  },
];

function ConfirmRestore({ employeeId }: { employeeId: number }) {
  const [open, setOpen] = useState(false);
  const [restoreEmployee, { isLoading: isRestoreEmployeeLoading }] =
    useRestoreEmployeeMutation();

  const handleRestoreEmployee = async () => {
    try {
      await restoreEmployee(employeeId).unwrap();
      setOpen(false);
      toast.success("User has been restored.");
    } catch (error) {
      toast.error(
        <ErrorExtractor
          mainMsg={error as ErrorResponse}
          arrayMsg={(error as ZodErrorResponse).data.errors}
        />
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        title={"Restore User?"}
        variant={"ghost"}
      >
        <ArrowUp />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to restore Employee?</DialogTitle>
          <DialogDescription>
            Restoring the employee will also restore its accounts. Click Proceed
            to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isRestoreEmployeeLoading}
            onClick={() => setOpen(false)}
            variant={"ghost"}
          >
            Cancel
          </Button>
          <Button
            disabled={isRestoreEmployeeLoading}
            onClick={handleRestoreEmployee}
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
