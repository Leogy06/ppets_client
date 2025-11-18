"use client";

import { PageHeader } from "@/app/(components)/page-header";
import { useRouterTransition } from "@/app/(hooks)/routerTransition";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetApprovedTransactionQuery,
  useGetTransactionQuery,
} from "@/lib/api/transactionApi";
import { Items, Transaction } from "@/types";
import { GrabIcon } from "lucide-react";
import React, { useState } from "react";

export default function Employee() {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
  });

  const { data: approvedItems, isLoading: isApprovedItemsLoading } =
    useGetApprovedTransactionQuery();

  const { isPending, push } = useRouterTransition();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <PageHeader text="My Assets" />
        <Button disabled={isPending} onClick={() => push("/employee/request")}>
          <GrabIcon />
          Request
        </Button>
      </div>
      {!approvedItems || approvedItems.length === 0 ? (
        <p className="text-center text-muted-foreground font-medium my-8">
          Empty, make some request.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {approvedItems.map((t) => (
            <AssetCards key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </>
  );
}

function AssetCards({ transaction }: { transaction: Transaction }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-accent/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
          {transaction.item.ITEM_NAME}
        </h2>

        <p className="text-sm text-foreground">
          {transaction.item.DESCRIPTION ?? "--"}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <span className="font-medium">Quantity: {transaction.quantity}</span>
          <div className="flex gap-2">
            <span className="inline-block text-white rounded-lg bg-primary px-4 py-1.5 text-sm font-medium shadow-sm transition-colors">
              ₱{transaction.item.UNIT_VALUE}
            </span>
            <ConfirmReturnItem item={transaction.item} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmReturnItem({ item }: { item: Items }) {
  return (
    <Dialog>
      <DialogTrigger>Return</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Return Item?</DialogTitle>
          <DialogDescription>Click Proceed to continue</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
