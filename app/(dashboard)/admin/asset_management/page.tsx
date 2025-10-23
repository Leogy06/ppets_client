"use client";

import React, { SetStateAction, useState } from "react";
import { DataTable } from "./data-table";
import { useCreateItemMutation, useGetItemsQuery } from "@/lib/api/itemsApi";
import { itemsColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { CreateItemDto } from "@/types/dto";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { parseNumberSafe } from "@/lib/utils";
import { extractedError } from "@/utils/errorExtractor";
import { toast } from "sonner";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";

const AssetManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemName, setItemName] = useState("");
  const { data, isLoading: isItemsLoading } = useGetItemsQuery({
    pageIndex,
    pageSize,
    itemName,
  });

  const handlePageSize = (value: number) => {
    setPageSize(value);
  };

  const handleIncreasePageIndex = () => {
    setPageIndex((prev) => prev + 1);
  };

  const handleDecreasePageIndex = () => {
    setPageIndex((prev) => prev - 1);
  };

  const handleItemNameOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  return (
    <div className=" container mx-auto py-10">
      <div className="flex flex-row justify-between items-center mb-4 ">
        <h3 className=" text-lg font-bold leading-tight tracking-tight">
          Asset Management
        </h3>
        <AddItemDialog />
      </div>
      <DataTable
        data={data?.items || []}
        columns={itemsColumn}
        pageSize={pageSize}
        pageIndex={pageIndex}
        handlePageSize={handlePageSize}
        handleIncreasePageIndex={handleIncreasePageIndex}
        handleDecreasePageIndex={handleDecreasePageIndex}
        isLoading={isItemsLoading}
        itemName={itemName}
        handleItemNameOnchange={handleItemNameOnchange}
        totalPages={data?.count || 0}
      />
    </div>
  );
};

//add item dialog
function AddItemDialog() {
  //for input

  const [formData, setFormData] = useState<CreateItemDto>({
    ITEM_NAME: "",
    DESCRIPTION: "",
    UNIT_VALUE: Number(""),
    QUANTITY: Number(""),
    RECEIVED_AT: "",
    PIS_NO: "",
    PROP_NO: "",
    SERIAL_NO: "",
    REMARKS: "",
    PAR_NO: "",
    MR_NO: "",
    ACCOUNT_CODE: Number(""),
    ICS_NO: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [creatItem, { isLoading: isCreateItemLoading }] =
    useCreateItemMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const inputs: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
  }[] = [
    {
      name: "ITEM_NAME",
      type: "text",
      label: "Item name",
      required: true,
    },
    {
      name: "DESCRIPTION",
      type: "text",
      label: "Description",
      required: true,
    },
    {
      name: "UNIT_VALUE",
      type: "number",
      label: "Unit value",
      required: true,
    },
    {
      name: "QUANTITY",
      type: "number",
      label: "Quantity",
      required: true,
    },
    {
      name: "PIS_NO",
      type: "text",
      label: "PIS no.",
    },
    {
      name: "PROP_NO",
      type: "text",
      label: "Prop no.",
    },
    {
      name: "SERIAL_NO",
      type: "text",
      label: "Serial no.",
    },
    {
      name: "ICS_NO",
      type: "text",
      label: "ICS no.",
    },
    {
      name: "REMARKS",
      type: "text",
      label: "Remarks",
    },
    {
      name: "PAR_NO",
      type: "text",
      label: "PAR no.",
    },
    {
      name: "MR_NO",
      type: "text",
      label: "MR no.",
    },
  ];

  const handleConfirm = async () => {
    try {
      const validateData = {
        ...formData,
        UNIT_VALUE: parseNumberSafe(formData.UNIT_VALUE),
        QUANTITY: parseNumberSafe(formData.QUANTITY),
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      await creatItem({ ...validateData }).unwrap();

      toast.success("Item created successfully!", {
        duration: 10000,
      });
    } catch (error) {
      console.error("Unable to create new item ", error);

      const errorMsg = extractedError(error);
      toast.error(
        <ErrorExtractor
          mainMsg={errorMsg}
          arrayMsg={(error as any)?.data?.errors}
        />,
        {
          duration: 10000,
        }
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[623px]  max-h-[425px] overflow-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle asChild>
              <h3>Add item</h3>
            </DialogTitle>
            <DialogDescription>Add new Items here</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
            {inputs.map(({ name, label, required, type }) => (
              <div key={name} className="grid gap-3">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  value={(formData as any)[name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [name]: e.target.value })
                  }
                  type={type}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required={required}
                />
              </div>
            ))}

            <DatePicker formData={formData} setFormData={setFormData} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="reset" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* 🟩 Child Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle asChild>
              <h3>Confirm Item Creation</h3>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to add this new item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isCreateItemLoading}>
              {isCreateItemLoading ? "Creating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function DatePicker({
  formData,
  setFormData,
}: {
  formData: CreateItemDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateItemDto>>;
}) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col">
          <Label className="mb-3">Received at</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Received date</span>}
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate ?? undefined);
            setFormData({
              ...formData,
              RECEIVED_AT: selectedDate ? selectedDate.toISOString() : "",
            });
          }}
          required
        />
      </PopoverContent>
    </Popover>
  );
}

export default AssetManagement;
