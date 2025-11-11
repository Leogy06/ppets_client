"use client";

import { StatusColor } from "@/app/(components)/common/status-color";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateStatusMutation } from "@/lib/api/transactionApi";
import { Employee, Status, Transaction } from "@/types";
import { formatDate } from "@/utils/dateFormatter";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, CircleOff, Clock, OctagonX } from "lucide-react";
import { useState } from "react";

export const requestColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "#",
    header: "Details",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-2">
          {/* item requested */}
          <h3 className="text--lg font-bold leading-tight">
            {row.original.item.ITEM_NAME}
          </h3>

          {/* requested by  */}
          <div className="flex flex-col">
            <h4 className="text-muted-foreground">Requested by</h4>
            <p className="text-sm">{employeeName(row.original.employee)}</p>
          </div>

          {/* reason  */}
          <div className="flex flex-col">
            <h4 className="text-muted-foreground">Reason</h4>
            <p>{row.original.reason}</p>
          </div>

          {/* approve & reject btn */}
          {row.original.status !== Status.PENDING ? null : (
            <div className="flex items-center gap-2">
              <StatusButton
                textStatus={Status.APPROVED}
                transaction={row.original}
              />
              <StatusButton
                textStatus={Status.REJECTED}
                transaction={row.original}
              />
            </div>
          )}
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
    cell: ({ row }) => <StatusColor status={row.original.status} />,
  },
];

function employeeName(employee: Employee) {
  return `${employee.LASTNAME}, ${employee.FIRSTNAME} ${
    employee.MIDDLENAME ?? ""
  } ${employee.SUFFIX ?? ""}`;
}

//rejected status
function StatusButton({
  textStatus,
  transaction,
}: {
  textStatus: Status;
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);
  const [updateTransactionStatus, { isLoading }] = useUpdateStatusMutation();
  const icon =
    textStatus === Status.APPROVED ? <CircleCheckBig /> : <CircleOff />;

  const handleUpdateStatus = async () => {
    try {
      const response = await updateTransactionStatus({
        transactionId: transaction.id,
        status: textStatus,
      }).unwrap();
      console.log("resposne ", response);
    } catch (error) {
      console.log("Unable to update status. ", error);
    }
    console.log("Status updated. ", textStatus);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        variant={textStatus === Status.APPROVED ? "default" : "ghost"}
      >
        {icon}
        {textStatus.toLowerCase()}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm {textStatus} request?</DialogTitle>
          <DialogDescription asChild>
            <ul className="space-y-3">
              <li>
                Are you sure want to{" "}
                {textStatus === Status.REJECTED ? "Reject" : textStatus} this
                request?
              </li>
              <li>
                <h2>{transaction.item.ITEM_NAME}</h2>
              </li>
              <li className="flex flex-col">
                <span className="text-muted-foreground">Request by:</span>
                {employeeName(transaction.employee)}
              </li>
              <li>Click Proceed to continue</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={() => setOpen(false)}
            variant={"ghost"}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} disabled={isLoading}>
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
