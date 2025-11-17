"use client";

import React, { useState } from "react";
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
import { CreateItemDto, ErrorResponse, ZodErrorResponse } from "@/types/dto";
import { motion } from "framer-motion";

export default function AssetManagement() {
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
    <>
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
    </>
  );
}

//add item dialog
function AddItemDialog() {
  //for input

  const [openCreateItemDialog, setOpenCreateItemDialog] = useState(false);

  const [formData, setFormData] = useState<CreateItemDto>({
    ITEM_NAME: "",
    DESCRIPTION: "",
    UNIT_VALUE: null,
    QUANTITY: null,
    RECEIVED_AT: "",
    PIS_NO: "",
    PROP_NO: "",
    SERIAL_NO: "",
    REMARKS: "",
    PAR_NO: "",
    MR_NO: "",
    ACCOUNT_CODE: null,
    ICS_NO: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [creatItem, { isLoading: isCreateItemLoading }] =
    useCreateItemMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numberFields = ["UNIT_VALUE", "QUANTITY"];

    setFormData((prevForm) => ({
      ...prevForm,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleConfirm = async () => {
    try {
      await creatItem(formData).unwrap();

      toast.success("Item created successfully!", {
        duration: 10000,
      });
      //close dialog
      setIsConfirmOpen(false);
      setOpenCreateItemDialog(false);

      //clear state
      setFormData({
        ITEM_NAME: "",
        DESCRIPTION: "",
        UNIT_VALUE: null,
        QUANTITY: null,
        RECEIVED_AT: "",
        PIS_NO: "",
        PROP_NO: "",
        SERIAL_NO: "",
        REMARKS: "",
        PAR_NO: "",
        MR_NO: "",
        ACCOUNT_CODE: null,
        ICS_NO: "",
      });
    } catch (error) {
      console.error("Unable to create new item ", error);

      toast.error(
        <ErrorExtractor
          mainMsg={error as ErrorResponse}
          arrayMsg={(error as ZodErrorResponse).data.errors}
        />,
        {
          duration: 10000,
        }
      );
    }
  };

  return (
    <Dialog open={openCreateItemDialog} onOpenChange={setOpenCreateItemDialog}>
      <Button onClick={() => setOpenCreateItemDialog(true)}>
        <Plus />
        Add item
      </Button>
      <DialogContent className="sm:max-w-[623px]  max-h-[425px] overflow-auto">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <DialogHeader>
            <DialogTitle asChild>
              <h3>Add item</h3>
            </DialogTitle>
            <DialogDescription>Add new Items here</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {/* ITEM_NAME */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid gap-1"
            >
              <Label htmlFor="ITEM_NAME">Item name</Label>
              <Input
                id="ITEM_NAME"
                name="ITEM_NAME"
                type="text"
                required
                value={formData.ITEM_NAME || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-1"
            >
              <Label htmlFor="DESCRIPTION">Description</Label>
              <Input
                id="DESCRIPTION"
                name="DESCRIPTION"
                type="text"
                required
                value={formData.DESCRIPTION || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* UNIT_VALUE */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid gap-1"
            >
              <Label htmlFor="UNIT_VALUE">Unit value</Label>
              <Input
                id="UNIT_VALUE"
                name="UNIT_VALUE"
                type="number"
                required
                value={formData.UNIT_VALUE?.toString() || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* QUANTITY */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid gap-1"
            >
              <Label htmlFor="QUANTITY">Quantity</Label>
              <Input
                id="QUANTITY"
                name="QUANTITY"
                type="number"
                required
                value={formData.QUANTITY?.toString() || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* PIS_NO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="grid gap-1"
            >
              <Label htmlFor="PIS_NO">PIS no.</Label>
              <Input
                id="PIS_NO"
                name="PIS_NO"
                type="text"
                value={formData.PIS_NO || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* PROP_NO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid gap-1"
            >
              <Label htmlFor="PROP_NO">Prop no.</Label>
              <Input
                id="PROP_NO"
                name="PROP_NO"
                type="text"
                value={formData.PROP_NO || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* SERIAL_NO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="grid gap-1"
            >
              <Label htmlFor="SERIAL_NO">Serial no.</Label>
              <Input
                id="SERIAL_NO"
                name="SERIAL_NO"
                type="text"
                value={formData.SERIAL_NO || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* ICS_NO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid gap-1"
            >
              <Label htmlFor="ICS_NO">ICS no.</Label>
              <Input
                id="ICS_NO"
                name="ICS_NO"
                type="text"
                value={formData.ICS_NO || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* REMARKS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid gap-1"
            >
              <Label htmlFor="REMARKS">Remarks</Label>
              <Input
                id="REMARKS"
                name="REMARKS"
                type="text"
                value={formData.REMARKS || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* PAR_NO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid gap-1"
            >
              <Label htmlFor="PAR_NO">PAR no.</Label>
              <Input
                id="PAR_NO"
                name="PAR_NO"
                type="text"
                value={formData.PAR_NO || ""}
                onChange={handleOnchange}
              />
            </motion.div>

            {/* MR_NO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="grid gap-1"
            >
              <Label htmlFor="MR_NO">MR no.</Label>
              <Input
                id="MR_NO"
                name="MR_NO"
                type="text"
                value={formData.MR_NO || ""}
                onChange={handleOnchange}
              />
            </motion.div>

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
        </motion.form>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="grid gap-1"
    >
      <Label htmlFor="MR_NO">Received Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Received date</span>}
          </Button>
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
          />
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
