"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import {
  useAddEmployeeMutation,
  useGetAllEmployeeQuery,
} from "@/lib/api/employeeApi";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import { CreateEmployeeDto } from "@/types/dto";
import { parseNumberSafe } from "@/lib/utils";
import { extractedError } from "@/utils/errorExtractor";
import { toast } from "sonner";

const Users = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [employeeNameFilter, setEmployeeNameFilter] = useState("");

  const { data: employeeData, isLoading: isEmployeeLoading } =
    useGetAllEmployeeQuery({
      pageIndex,
      pageSize,
      employeeName: employeeNameFilter,
    });
  return (
    <div className=" container mx-auto py-10">
      <div className="flex flex-col gap-3 mb-4">
        <h3 className=" text-lg font-bold leading-tight tracking-tight">
          Users
        </h3>
        <div className="flex justify-between items-center">
          <Input
            onChange={(e) => setEmployeeNameFilter(e.target.value)}
            value={employeeNameFilter}
            placeholder="Search employee..."
            className="w-[260px]"
          />
          <AddEmployee />
        </div>
      </div>
      <DataTable data={employeeData?.employees || []} columns={columns} />
      <div className="flex items-center justify-end">
        <span>
          Page {pageIndex}-{pageSize} of{" "}
          {Math.ceil((employeeData?.count || 0) / pageSize)}
        </span>
        <Button
          variant={"ghost"}
          size={"icon-sm"}
          disabled={pageIndex <= 1}
          onClick={() => setPageIndex((prev) => prev - 1)}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant={"ghost"}
          size={"icon-sm"}
          disabled={
            pageIndex >= Math.ceil((employeeData?.count || 0) / pageSize)
          }
          onClick={() => setPageIndex((prev) => prev + 1)}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

function AddEmployee() {
  const [openAddEmployee, setOpenAddEmployee] = useState(false);

  const [openConfirmAddEmployee, setOpenConfirmAddEmployee] = useState(false);

  const [formData, setFormData] = useState<CreateEmployeeDto>({
    ID_NUMBER: "",
    FIRSTNAME: "",
    LASTNAME: "",
    MIDDLENAME: "",
    SUFFIX: "",
  });

  const [addEmployee, { isLoading: isAddEmployeeLoading }] =
    useAddEmployeeMutation();

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenConfirmAddEmployee(true);
  };

  const handleConfirmSubmit = async () => {
    const validTypesData: Partial<Employee> = {
      ...formData,
      ID_NUMBER: parseNumberSafe(formData.ID_NUMBER),
      FIRSTNAME: formData.FIRSTNAME?.toUpperCase(),
      LASTNAME: formData.LASTNAME?.toUpperCase(),
      SUFFIX: formData.SUFFIX?.toUpperCase(),
      MIDDLENAME: formData.MIDDLENAME?.toUpperCase(),
    };

    try {
      await addEmployee(validTypesData).unwrap();

      toast.success("Employee has been added.");
      setOpenAddEmployee(false);
      setOpenConfirmAddEmployee(false);
    } catch (error) {
      console.error("Unable to add employee. ", error);
      const errMsg = extractedError(error);
      toast.error(errMsg, {
        duration: 6000,
      });
    }
  };

  return (
    <Dialog open={openAddEmployee} onOpenChange={setOpenAddEmployee}>
      <Button onClick={() => setOpenAddEmployee(true)}>
        <Plus />
        Add employee
      </Button>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle asChild>
              <h3 className="text-lg">Add employee</h3>
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3 my-4">
            <div className="grid gap-3">
              <Label htmlFor="FIRSTNAME">ID number</Label>
              <Input
                name="ID_NUMBER"
                placeholder="Enter ID number"
                required
                onChange={handleChangeForm}
                value={formData.ID_NUMBER}
                type="number"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="FIRSTNAME">First name</Label>
              <Input
                name="FIRSTNAME"
                placeholder="Enter firstname"
                required
                onChange={handleChangeForm}
                value={formData.FIRSTNAME}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="LASTNAME">Last name</Label>
              <Input
                name="LASTNAME"
                placeholder="Enter lastname"
                required
                onChange={handleChangeForm}
                value={formData.LASTNAME}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="MIDDLENAME">Middle name</Label>
              <Input
                name="MIDDLENAME"
                placeholder="Enter middlename"
                onChange={handleChangeForm}
                value={formData.MIDDLENAME}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="SUFFIX">Suffix name</Label>
              <Input
                name="SUFFIX"
                placeholder="Enter suffix"
                onChange={handleChangeForm}
                value={formData.SUFFIX}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="reset"
              onClick={() => setOpenAddEmployee(false)}
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Dialog
        open={openConfirmAddEmployee}
        onOpenChange={setOpenConfirmAddEmployee}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle asChild>
              <h3>Confirm add employee?</h3>
            </DialogTitle>
            <DialogDescription>
              Take note! This employee will be in the same department with you.
              Are you sure you want to add employee? Click Proceed to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setOpenConfirmAddEmployee(false)}
              variant={"ghost"}
              disabled={isAddEmployeeLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={isAddEmployeeLoading}
            >
              {isAddEmployeeLoading ? "Processing..." : "Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default Users;
