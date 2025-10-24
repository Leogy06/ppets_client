"use client";

import { Button } from "@/components/ui/button";
import { Condition, Items } from "@/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useUpdateItemMutation } from "@/lib/api/itemsApi";
import { toast } from "sonner";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";
import { extractedError } from "@/utils/errorExtractor";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import React from "react";
import { useFindAllAccountCodesQuery } from "@/lib/api/accountCodeApi";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const itemsColumn: ColumnDef<Items>[] = [
  {
    accessorKey: "ITEM_NAME",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <ArrowUpDown className="ml-4 h-4 w-4" />
        </Button>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, value) => {
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      return cellValue.includes(String(value).toLowerCase());
    },
  },
  {
    accessorKey: "UNIT_VALUE",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-4 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("UNIT_VALUE"));

      //format the amount
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);

      return <div className="text-left font-medium">{formattedAmount}</div>;
    },

    //sorting numerically
    sortingFn: (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.getValue(columnId)) || 0;
      const b = parseFloat(rowB.getValue(columnId)) || 0;

      return a - b;
    },
  },
  {
    accessorKey: "QUANTITY",
    header: "Quantity",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      return (
        <span
          className={`
        ${itemConditionTextColor(row.getValue("condition"))}
         tracking-tighter font-semibold`}
        >
          {row.getValue("condition")}
        </span>
      );
    },
  },
  {
    accessorKey: "ID",
    header: "Actions",
    cell: ({ row }) => {
      return <EditDialog row={row} />;
    },
  },
];

function itemConditionTextColor(condition: Condition) {
  switch (condition) {
    case "EXCELLENT":
      return "text-green-500";
    case "GOOD":
      return "text-blue-500";
    case "POOR":
      return "text-purple-500";
    case "REPAIR":
      return "text-red-500";
    case "MAINTENANCE":
      return "text-yellow-500";
    default:
      return "text-foreground";
  }
}

function EditDialog({ row }: { row: Row<Items> }) {
  const [openConfirmEditItem, setOpenConfirmEditItem] = useState(false);
  const [openUpdateItemDialog, setOpenUpdateItemDialog] = useState(false);

  const [formData, setFormData] = useState({
    ITEM_NAME: "",
    DESCRIPTION: "",
    UNIT_VALUE: "",
    QUANTITY: "",
    RECEIVED_AT: "",
    PIS_NO: "",
    PROP_NO: "",
    SERIAL_NO: "",
    REMARKS: "",
    PAR_NO: "",
    MR_NO: "",
    ACCOUNT_CODE: "",
    ICS_NO: "",
    condition: "",
  });

  const [updateItem, { isLoading }] = useUpdateItemMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenConfirmEditItem(true);
  };

  const handleUpdateItem = async () => {
    try {
      const validFormDataType: Partial<Items> = {
        ID: row.original.ID,
        ITEM_NAME: formData.ITEM_NAME,
        DESCRIPTION: formData.DESCRIPTION,
        UNIT_VALUE: Number(formData.UNIT_VALUE),
        QUANTITY: Number(formData.QUANTITY),
        RECEIVED_AT: formData.RECEIVED_AT,
        PIS_NO: formData.PIS_NO,
        PROP_NO: formData.PROP_NO,
        MR_NO: formData.MR_NO,
        ACCOUNT_CODE: Number(formData.ACCOUNT_CODE), // this is an Id
        ICS_NO: formData.ICS_NO,
        SERIAL_NO: formData.SERIAL_NO,
        REMARKS: formData.REMARKS,
        PAR_NO: formData.PAR_NO,
        condition: formData.condition,
      };

      await updateItem(validFormDataType).unwrap();

      toast.success("Item updated!", {
        duration: 6000,
      });

      setOpenConfirmEditItem(false);
    } catch (error) {
      const errorMsg = extractedError(error);

      toast.error(
        <ErrorExtractor
          mainMsg={errorMsg}
          arrayMsg={(error as any)?.data?.errors}
        />
      );
    }
  };

  return (
    <Dialog open={openUpdateItemDialog} onOpenChange={setOpenUpdateItemDialog}>
      <Button
        variant={"ghost"}
        onClick={() => {
          setFormData({
            ITEM_NAME: row.original.ITEM_NAME,
            DESCRIPTION: row.original.DESCRIPTION,
            UNIT_VALUE: row.original.UNIT_VALUE.toString(),
            QUANTITY: row.original.QUANTITY.toString(),
            RECEIVED_AT: row.original.RECEIVED_AT,
            PIS_NO: row.original.PIS_NO ?? "",
            PROP_NO: row.original.PROP_NO ?? "",
            SERIAL_NO: row.original.SERIAL_NO ?? "",
            REMARKS: row.original.REMARKS ?? "",
            PAR_NO: row.original.PAR_NO ?? "",
            MR_NO: row.original.MR_NO ?? "",
            ACCOUNT_CODE: row.original.ACCOUNT_CODE.toString(),
            ICS_NO: row.original.ICS_NO ?? "",
            condition: row.original.condition,
          });

          setOpenUpdateItemDialog(true);
        }}
      >
        <Edit />
      </Button>
      <DialogContent className="container max-h-5/6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            <h3>Edit item</h3>
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="grid gap-2">
                <Label>Item</Label>
                <Input
                  value={formData.ITEM_NAME.toString()}
                  onChange={handleChange}
                  name="ITEM_NAME"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={formData.DESCRIPTION.toString()}
                  onChange={handleChange}
                  name="DESCRIPTION"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Unit value</Label>
                <Input
                  value={formData.UNIT_VALUE.toString()}
                  onChange={handleChange}
                  name="UNIT_VALUE"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className=" capitalize">Quantity</Label>
                <Input
                  value={formData.QUANTITY.toString()}
                  onChange={handleChange}
                  name="QUANTITY"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Condition</Label>
                <Select
                  onValueChange={(val) =>
                    setFormData((prevForm) => ({
                      ...prevForm,
                      condition: val,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={formData.condition} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">EXCELLENT</SelectItem>
                    <SelectItem value="GOOD">GOOD</SelectItem>
                    <SelectItem value="POOR">POOR</SelectItem>
                    <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                    <SelectItem value="REPAIR">REPAIR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* 
              this is a date
              <div className="grid gap-2">
                <Label className=" capitalize">RECEIVED AT</Label>
                <Input
                  value={formData.RECEIVED_AT.toString()}
                  onChange={handleChange}
                  name="RECEIVED_AT"
                />
              </div> */}
              <div className="grid gap-2">
                <Label className=" capitalize">PIS no.</Label>
                <Input
                  value={formData.PIS_NO.toString()}
                  onChange={handleChange}
                  name="PIS_NO"
                />
              </div>
              <div className="grid gap-2">
                <Label className=" capitalize">PROP no.</Label>
                <Input
                  value={formData.PROP_NO.toString()}
                  onChange={handleChange}
                  name="PROP_NO"
                />
              </div>
              <div className="grid gap-2">
                <Label className=" capitalize">SERIAL no</Label>
                <Input
                  value={formData.SERIAL_NO.toString()}
                  onChange={handleChange}
                  name="SERIAL_NO"
                />
              </div>
              <div className="grid gap-2">
                <Label className=" capitalize">PAR no.</Label>
                <Input
                  value={formData.PAR_NO.toString()}
                  onChange={handleChange}
                  name="PAR_NO"
                />
              </div>
              <div className="grid gap-2">
                <Label className=" capitalize">MR no.</Label>
                <Input
                  value={formData.MR_NO.toString()}
                  onChange={handleChange}
                  name="MR_NO"
                />
              </div>
              <div className="grid gap-2 overflow-hidden">
                <Label>Account Code</Label>
                <AccountCodeSelect
                  value={formData.ACCOUNT_CODE.toString()}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      ACCOUNT_CODE: val,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label className=" capitalize">REMARKS</Label>
                <Input
                  value={formData.REMARKS.toString()}
                  onChange={handleChange}
                  name="REMARKS"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-center md:justify-end mt-4">
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => setOpenUpdateItemDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
      <Dialog open={openConfirmEditItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle asChild>
              <h3>Are you absolutely sure?</h3>
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will edit the details of the
              item.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setOpenConfirmEditItem(false)}
              variant={"ghost"}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>
              {isLoading ? "Loading..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function AccountCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = useFindAllAccountCodesQuery();

  const selectedAccount = data?.find((acc) => acc.ID.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAccount
            ? `${selectedAccount.ACCOUNT_TITLE}`
            : "Find account code"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search account code..." className="h-9" />
          <CommandList>
            <CommandEmpty>No account code found.</CommandEmpty>
            <CommandGroup>
              {data?.map((accCode) => (
                <CommandItem
                  key={accCode.ID}
                  value={`${accCode.ACCOUNT_TITLE} ${accCode.ACCOUNT_CODE}`}
                  onSelect={() => {
                    onChange(accCode.ID.toString()); // 🔹 send selected value to parent
                    setOpen(false);
                  }}
                >
                  {accCode.ACCOUNT_TITLE}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === accCode.ID.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
