"use client";

import { Button } from "@/components/ui/button";
import {
  useDeleteEmployeeMutation,
  useEditEmployeeMutation,
} from "@/lib/api/employeeApi";
import { Employee } from "@/types";
import { formatDate } from "@/utils/dateFormatter";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, IdCard, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ErrorExtractor from "@/app/(components)/ErrorExtractor";
import {
  ErrorResponse,
  UpdateEmployeeDto,
  ZodErrorResponse,
} from "@/types/dto";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { nameJoiner, parseNumberSafe } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreateUserEmployeeMutation,
  useGetUserEmployeeQuery,
  useUpdateUserActiveStatusMutation,
} from "@/lib/api/userApi";
import { readUserRole } from "@/utils/checkUserRole";
import ReadStatus from "@/app/(components)/read-status";
import { Switch } from "@/components/ui/switch";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "LASTNAME",
    header: "Name",
    cell: ({ row }) => {
      return nameJoiner(row.original);
    },
  },
  {
    accessorKey: "CURRENT_DPT_ID",
    header: "Department",
    cell: ({ row }) => {
      return departmentReader(row.getValue("CURRENT_DPT_ID"));
    },
  },
  {
    accessorKey: "UPDATED_WHEN",
    header: "Last update",
    cell: ({ row }) => {
      return formatDate(row.getValue("UPDATED_WHEN")) ?? "--";
    },
  },
  {
    accessorKey: "#",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <EditEmployee employee={row.original} />
          <DeleteEmployee employeeId={row.original.ID} />
          <EmployeeUser employeeId={row.original.ID} />
        </div>
      );
    },
  },
];

function DeleteEmployee({ employeeId }: { employeeId: number }) {
  const [openDeleteEmployee, setOpenDeleteEmployee] = useState(false);
  const [deleteEmployee, { isLoading: isEmployeeDeleteLoading }] =
    useDeleteEmployeeMutation();

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(employeeId).unwrap();

      setOpenDeleteEmployee(false);
      toast.success("Employee has been deleted.");
    } catch (error) {
      toast.error(
        <ErrorExtractor
          mainMsg={error as ErrorResponse}
          arrayMsg={(error as ZodErrorResponse).data.errors}
        />
      );
    }
  };

  return (
    <Dialog open={openDeleteEmployee} onOpenChange={setOpenDeleteEmployee}>
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        onClick={() => setOpenDeleteEmployee(true)}
        title="Delete employee?"
      >
        <Trash />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h3 className="text-lg leading-tight font-bold">
              Confirm delete employee?
            </h3>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete employee? This action is
            irreversable. Click Proceed to continue. P.S. It will also
            deactivate employee's profile.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"ghost"}
            onClick={() => setOpenDeleteEmployee(false)}
            disabled={isEmployeeDeleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteEmployee}
            disabled={isEmployeeDeleteLoading}
          >
            {isEmployeeDeleteLoading ? "Processing..." : "Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditEmployee({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [formData, setFormData] = useState<UpdateEmployeeDto>({
    FIRSTNAME: employee.FIRSTNAME,
    LASTNAME: employee.LASTNAME,
    MIDDLENAME: employee.MIDDLENAME,
    SUFFIX: employee.SUFFIX,
    ID_NUMBER: employee.ID_NUMBER,
  });

  const [editEmployee, { isLoading: isEditEmployeeLoading }] =
    useEditEmployeeMutation();

  // update empoloyee form when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        FIRSTNAME: employee.FIRSTNAME,
        LASTNAME: employee.LASTNAME,
        MIDDLENAME: employee.MIDDLENAME,
        SUFFIX: employee.SUFFIX,
        ID_NUMBER: employee.ID_NUMBER,
      });
    }
  }, [employee]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleOpenConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenConfirm(true);
  };

  const handleSubmitUpdate = async () => {
    const validFormData: UpdateEmployeeDto = {
      ...formData,
      ID: employee.ID,
      ID_NUMBER: parseNumberSafe(formData.ID_NUMBER),
      FIRSTNAME: formData.FIRSTNAME?.toUpperCase(),
      LASTNAME: formData.LASTNAME?.toUpperCase(),
      MIDDLENAME: formData.MIDDLENAME?.toUpperCase(),
      SUFFIX: formData.SUFFIX?.toUpperCase(),
    };

    try {
      await editEmployee(validFormData as Employee).unwrap();

      toast.success("Employee has been updated.");

      setOpen(false);
      setOpenConfirm(false);
    } catch (error) {
      console.error("Unable to update employee.", error);
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
      <Button variant={"ghost"} onClick={() => setOpen(true)}>
        <Edit />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Form</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleOpenConfirm}>
          <div className=" grid md:grid-cols-2 gap-3">
            <div className="grid gap-3">
              <Label>ID number</Label>
              <Input
                name="ID_NUMBER"
                onChange={handleOnChange}
                type="number"
                value={formData?.ID_NUMBER?.toString() || ""}
                placeholder="Enter ID number"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label>Firstname</Label>
              <Input
                name="FIRSTNAME"
                onChange={handleOnChange}
                value={formData.FIRSTNAME || ""}
                placeholder="Enter firstname"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label>Lastname</Label>
              <Input
                name="LASTNAME"
                onChange={handleOnChange}
                value={formData.LASTNAME || ""}
                placeholder="Enter lastname"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label>Middlename</Label>
              <Input
                name="MIDDLENAME"
                onChange={handleOnChange}
                value={formData.MIDDLENAME || ""}
                placeholder="Enter middlename"
              />
            </div>
            <div className="grid gap-3">
              <Label>Suffix</Label>
              <Input
                name="SUFFIX"
                onChange={handleOnChange}
                value={formData.SUFFIX || ""}
                placeholder="Enter suffix"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant={"ghost"}
              type="reset"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to update Employee?</DialogTitle>
            <DialogDescription>Click Proceed to continue.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isEditEmployeeLoading}
              variant={"ghost"}
              onClick={() => setOpenConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitUpdate}
              disabled={isEditEmployeeLoading}
            >
              {isEditEmployeeLoading ? "Processing..." : "Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function EmployeeUser({ employeeId }: { employeeId: number }) {
  const { data, isLoading } = useGetUserEmployeeQuery(employeeId);
  const [open, setOpen] = useState(false);

  //for user employee create
  const [openCreateAdmin, setOpenCreateAdmin] = useState(false);

  const [openCreateEmployee, setOpenCreateEmployee] = useState(false);

  const [updateActiveStatus, { isLoading: isUpdateActiveStatusLoading }] =
    useUpdateUserActiveStatusMutation();

  const [createUserEmployee, { isLoading: isCreateUserEmployeeLoading }] =
    useCreateUserEmployeeMutation();

  const handleUpdateUserActiveStatus = async (
    activeStatus: number,
    userId: number
  ) => {
    const status = activeStatus === 1 ? 0 : 1;
    try {
      await updateActiveStatus({
        userId,
        activeStatus: status,
      }).unwrap();
    } catch (error) {
      console.error("Unable to update user active status. ", error);
    }
  };

  const handleCreateUserEmployee = async (role: number) => {
    console.log("EMp ", employeeId);
    console.log("role ", role);

    try {
      await createUserEmployee({
        empId: employeeId,
        role,
      }).unwrap();

      handleCloseCreateUser(); // close dialog

      toast.success("The account for employee has been created!");
    } catch (error) {
      console.error("Unable to create user. ", error);
      toast.error(
        <ErrorExtractor
          mainMsg={error as ErrorResponse}
          arrayMsg={(error as ZodErrorResponse).data.errors}
        />,
        {
          duration: 6000,
        }
      );
    }
  };

  const handleCloseCreateUser = () => {
    if (openCreateAdmin) {
      setOpenCreateAdmin(false);
    }
    if (openCreateEmployee) {
      setOpenCreateEmployee(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setOpen(true)} variant={"ghost"}>
            <IdCard />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>See Employee Account(s)</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Employee's accounts</DialogTitle>
              <DialogDescription>
                {data?.employee && nameJoiner(data.employee)} <br />
                These are employee's account(s) listed.
              </DialogDescription>

              {/* make an employee account  */}
              <Dialog
                open={openCreateEmployee}
                onOpenChange={setOpenCreateEmployee}
              >
                <Button onClick={() => setOpenCreateEmployee(true)}>
                  Make employee account
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm create user employee?</DialogTitle>
                    <DialogDescription>
                      The default{" "}
                      <strong>password is the employee's ID number</strong>{" "}
                      <br /> and u
                      <strong>
                        sername is ID number + underscore + role (e.g.
                        admin/employee
                      </strong>
                      ) no spaces. Click Proceed to continue.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      disabled={isCreateUserEmployeeLoading}
                      onClick={() => handleCreateUserEmployee(2)}
                    >
                      Proceed
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* make an admin account  */}
              <Dialog open={openCreateAdmin} onOpenChange={setOpenCreateAdmin}>
                <Button onClick={() => setOpenCreateAdmin(true)}>
                  Make admin account
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm create user employee?</DialogTitle>
                    <DialogDescription>
                      The default password is the employee's ID number <br />{" "}
                      and username is ID number + underscore + ID number no
                      spaces. Click Proceed to continue.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      disabled={isCreateUserEmployeeLoading}
                      onClick={() => handleCreateUserEmployee(1)}
                    >
                      Proceed
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DialogHeader>
            {data && (
              <div className="my-4">
                <table className="w-full">
                  {data?.userProfiles?.length >= 1 && (
                    <thead>
                      <tr>
                        <td className="px-4 py-2">Role</td>
                        <td className="px-4 py-2">Status</td>
                        <td className="px-4 py-2">Actions</td>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {data?.userProfiles.length === 0 ? (
                      <tr>
                        <td className="text-center px-4 py-2 w-full">
                          "No account found"
                        </td>
                      </tr>
                    ) : (
                      data?.userProfiles.map((profile) => (
                        <tr key={profile.id}>
                          <td className="px-4 py-2">
                            {readUserRole(profile.role)}
                          </td>
                          <td className="px-4 py-2">
                            <ReadStatus status={profile.is_active} />
                          </td>
                          <td className="px-4 py-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Switch
                                    disabled={isUpdateActiveStatusLoading}
                                    checked={profile.is_active === 1}
                                    onCheckedChange={() =>
                                      handleUpdateUserActiveStatus(
                                        profile.is_active,
                                        profile.id
                                      )
                                    }
                                  />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Disable/Enable user active status</p>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

//use also by archive user
// @Param is a number department ID
export function departmentReader(dptId: number) {
  switch (dptId) {
    case 1:
      return "City Accountant's Office";

    default:
      return "Unknown Department";
  }
}
