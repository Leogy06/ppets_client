"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  totalPages: number;
  handlePageSize: (value: number) => void;
  handleIncreasePageIndex: () => void;
  handleDecreasePageIndex: () => void;
  isLoading: boolean;

  //for queries params
  pageIndex: number;
  pageSize: number;
  itemName: string;
  handleItemNameOnchange: (params: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handlePageSize,
  handleIncreasePageIndex,
  handleDecreasePageIndex,

  //for queries params
  pageIndex,
  pageSize,
  itemName,
  handleItemNameOnchange,
  totalPages,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting, // ✅ Tell the table how to update sort state
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // enable sorting
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="overflow-hidden rounded-md border">
      {/* 👇 We'll add search bar above the table */}
      <div className="p-2 flex justify-between">
        <Input
          type="text"
          placeholder="Search item..."
          value={itemName || ""}
          onChange={handleItemNameOnchange}
          className="border rounded-md px-3 py-2 w-64"
        />
      </div>

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end px-4 py-2 gap-x-4 border-t">
        <div className="flex items-center gap-2">
          <span className=" leading-tight tracking-tight text-sm">
            Rows per page
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                {pageSize}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" items-stretch">
              <DropdownMenuLabel className="text-center">
                Select
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  className="w-full"
                  variant={"ghost"}
                  onClick={() => handlePageSize(5)}
                  size={"icon"}
                >
                  5
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className="w-full"
                  variant={"ghost"}
                  onClick={() => handlePageSize(10)}
                  size={"icon"}
                >
                  10
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className="w-full"
                  variant={"ghost"}
                  onClick={() => handlePageSize(15)}
                  size={"icon"}
                >
                  15
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className="w-full"
                  variant={"ghost"}
                  onClick={() => handlePageSize(20)}
                  size={"icon"}
                >
                  20
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1 text-sm leading-tight tracking-tight">
          Page {pageIndex}-{pageSize} of {Math.ceil(totalPages / pageSize)}{" "}
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={handleDecreasePageIndex}
            disabled={pageIndex === 1}
          >
            <ArrowLeft />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={handleIncreasePageIndex}
            disabled={pageIndex === Math.ceil(totalPages / pageSize)}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
