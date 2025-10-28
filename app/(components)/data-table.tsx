"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import React, { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;

  //pagination
  handleChangePageSize: (val: number) => void;
  pageSize: number;
  pageIndex: number;
  count: number;
  handlePageIndex: (param: boolean) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,

  //pagination
  handleChangePageSize,
  pageSize,
  pageIndex,
  count,
  handlePageIndex,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [isPending] = useTransition();

  return (
    <section className="overflow-hidden rounded-md border">
      {isLoading || isPending ? (
        <DatabatableLoading columns={columns.length} />
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex justify-end items-center gap-3">
                  <span>
                    Rows Per Page{" "}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>{pageSize}</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Rows Per Page</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            className="w-full"
                            onClick={() => handleChangePageSize(5)}
                          >
                            5
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            className="w-full"
                            onClick={() => handleChangePageSize(10)}
                          >
                            10
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            className="w-full"
                            onClick={() => handleChangePageSize(20)}
                          >
                            20
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            className="w-full"
                            onClick={() => handleChangePageSize(30)}
                          >
                            30
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            className="w-full"
                            onClick={() => handleChangePageSize(count)}
                          >
                            All
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </span>
                  <span>
                    Page {pageIndex}-{pageSize} of{" "}
                    {Math.ceil((count || 0) / pageSize)}
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"icon-sm"}
                    disabled={pageIndex <= 1}
                    onClick={() => handlePageIndex(false)}
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"icon-sm"}
                    disabled={pageIndex >= Math.ceil((count || 0) / pageSize)}
                    onClick={() => handlePageIndex(true)}
                  >
                    <ArrowRight />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </section>
  );
}

function DatabatableLoading({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton className="w-14 h-4" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DatabatableLoading;
