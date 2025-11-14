"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAvailableItemsQuery,
  useGetItemsQuery,
} from "@/lib/api/itemsApi";
import {
  CreateTransactionDto,
  ErrorResponse,
  ZodErrorResponse,
} from "@/types/dto";
import { useCreateTransactionMutation } from "@/lib/api/transactionApi";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";

const RequestAsset = () => {
  return (
    <>
      <div className="p-4 space-y-3 rounded-lg border">
        <h3>Request Asset</h3>
        <CreateRequest />
      </div>
    </>
  );
};

function CreateRequest() {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
  });

  //create transaction
  const [openConfirmCreateTransaction, setOpenConfirmCreateTransaction] =
    useState(false);
  const [transactionFormData, setTransactionFormData] =
    useState<CreateTransactionDto>({
      itemId: null,
      reason: "",
      quantity: null,
    });

  const { data: availableItems, isLoading: isAvailableItemsLoading } =
    useGetAvailableItemsQuery();

  const [createTransaction, { isLoading: isCreateTransactionLoading }] =
    useCreateTransactionMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenConfirmCreateTransaction(true);
  };

  const handleCreateTransaction = async () => {
    try {
      const response = await createTransaction(transactionFormData).unwrap();

      //reset the form and close the dialog
      setTransactionFormData({
        itemId: null,
        reason: "",
        quantity: null,
      });
      setOpenConfirmCreateTransaction(false);
    } catch (error) {
      console.error("Unable to create transaction ", error);
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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <Label>Select Item</Label>
        <Select
          required
          value={
            transactionFormData.itemId
              ? transactionFormData.itemId.toString()
              : ""
          }
          onValueChange={(value) =>
            setTransactionFormData((prevForm) => ({
              ...prevForm,
              itemId: parseInt(value),
            }))
          }
        >
          <SelectTrigger
            disabled={isAvailableItemsLoading}
            className="w-[180px]"
          >
            <SelectValue placeholder="Items" />
          </SelectTrigger>
          <SelectContent>
            {availableItems?.availableItems.map((i) => (
              <SelectItem key={i.ID} value={i.ID.toString()}>
                {i.ITEM_NAME} <br /> Qty:{" "}
                {`${i.QUANTITY} / ${i.originalQuantity}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid gap-3">
          <Label>Quantity</Label>
          <Input
            required
            type="number"
            value={transactionFormData.quantity || ""}
            onChange={(e) =>
              setTransactionFormData((prevForm) => ({
                ...prevForm,
                quantity: parseInt(e.target.value),
              }))
            }
            onWheel={(e) => e.currentTarget.blur()}
            placeholder="Must be a number"
          />
        </div>
        <div className="grid gap-3">
          <Label>Reason for requesting the item</Label>
          <Textarea
            required
            value={transactionFormData.reason || ""}
            onChange={(e) =>
              setTransactionFormData((prevForm) => ({
                ...prevForm,
                reason: e.target.value,
              }))
            }
            placeholder="Type you reason here"
          />
        </div>
        <Dialog
          open={openConfirmCreateTransaction}
          onOpenChange={setOpenConfirmCreateTransaction}
        >
          <Button type="submit">Submit</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm create transaction?</DialogTitle>
              <DialogDescription>Click Proceed to continue</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                disabled={isCreateTransactionLoading}
                onClick={handleCreateTransaction}
              >
                Proceed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
}

export default RequestAsset;
