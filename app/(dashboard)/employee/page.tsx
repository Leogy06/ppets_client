"use client";

import { DataTable } from "@/app/(components)/data-table";
import { PageHeader } from "@/app/(components)/page-header";
import { useRouterTransition } from "@/app/(hooks)/routerTransition";
import { Button } from "@/components/ui/button";
import { useGetTransactionQuery } from "@/lib/api/transactionApi";
import { Transaction } from "@/types";
import { GrabIcon } from "lucide-react";
import React, { useState } from "react";

const Employee = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
  });

  const { data: transactions, isLoading: isTransactionsLoading } =
    useGetTransactionQuery({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });

  const { isPending, push } = useRouterTransition();

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader text="My Assets" />
        <Button disabled={isPending} onClick={() => push("/employee/request")}>
          <GrabIcon />
          Request
        </Button>
      </div>
      {!transactions || transactions.transactions.length === 0 ? (
        <p className="text-center text-muted-foreground font-medium my-8">
          Empty, make some request.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {transactions?.transactions.map((t) => (
            <AssetCards key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </>
  );
};

function AssetCards({ transaction }: { transaction: Transaction }) {
  return (
    <div className="p-4 rounded-lg h-[280px] border">
      {transaction.item.ITEM_NAME}
    </div>
  );
}

export default Employee;
