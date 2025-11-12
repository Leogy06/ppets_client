"use client";

import { StatusColor } from "@/app/(components)/common/status-color";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useApproveTransactionMutation,
  useRejectTransactionMutation,
} from "@/lib/api/transactionApi";
import { Employee, Status, Transaction } from "@/types";
import { ErrorResponse, ZodErrorResponse } from "@/types/dto";
import { formatDate } from "@/utils/dateFormatter";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBig, CircleOff, Clock, OctagonX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  const [approveTransaction, { isLoading: isApproveTransactionLoading }] =
    useApproveTransactionMutation();
  const [rejectTransaction, { isLoading: isRejectTransactionloading }] =
    useRejectTransactionMutation();

  const icon =
    textStatus === Status.APPROVED ? <CircleCheckBig /> : <CircleOff />;

  const handleUpdateTransaction = async () => {
    try {
      if (textStatus === Status.APPROVED) {
        await approveTransaction({ transactionId: transaction.id }).unwrap();
        toast.success("Transaction approved succesfully!");
      } else if (textStatus === Status.REJECTED) {
        await rejectTransaction({ transactionId: transaction.id }).unwrap();
        toast.info("Transaction has been rejected.");
      } else {
        throw new Error("Unknown action.");
      }
    } catch (error) {
      console.error("Unable to update transaction. ", error);
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
            disabled={isApproveTransactionLoading || isRejectTransactionloading}
            onClick={() => setOpen(false)}
            variant={"ghost"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTransaction}
            disabled={isApproveTransactionLoading || isRejectTransactionloading}
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
