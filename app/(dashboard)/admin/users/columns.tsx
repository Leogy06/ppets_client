"use client";

import { Button } from "@/components/ui/button";
import { useDeleteEmployeeMutation } from "@/lib/api/employeeApi";
import { Employee } from "@/types";
import { formatDate } from "@/utils/dateFormatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";
import { ErrorResponse, ZodErrorResponse } from "@/types/dto";

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
          <DeleteEmployee employeeId={row.original.ID} />
        </div>
      );
    },
  },
];

function DeleteEmployee({ employeeId }: { employeeId: number }) {
  const [openDeleteEmployee, setOpenDeleteEmployee] = useState(false);
  const [deleteEmployee, { isLoading: isEmployeeDeleteLoading }] =
    useDeleteEmployeeMutation();

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(employeeId).unwrap();

      setOpenDeleteEmployee(false);
      toast.success("Employee has been deleted.");
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
    <Dialog open={openDeleteEmployee} onOpenChange={setOpenDeleteEmployee}>
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        onClick={() => setOpenDeleteEmployee(true)}
      >
        <Trash />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h3 className="text-lg leading-tight font-bold">
              Confirm delete employee?
            </h3>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete employee? This action is
            irreversable. Click Proceed to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"ghost"}
            onClick={() => setOpenDeleteEmployee(false)}
            disabled={isEmployeeDeleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteEmployee}
            disabled={isEmployeeDeleteLoading}
          >
            {isEmployeeDeleteLoading ? "Processing..." : "Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function departmentReader(dptId: number) {
  switch (dptId) {
    case 1:
      return "City Accountant's Office";

    default:
      return "Unknown Department";
  }
}
