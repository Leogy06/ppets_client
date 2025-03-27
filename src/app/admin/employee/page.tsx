"use client";
import {
  useDeleteEmployeesMutation,
  useEditEmployeeMutation,
  useGetEmployeeCountQuery,
  useGetEmployeesQuery,
} from "@/features/api/apiSlice";
import { Button } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { Employee as EmployeeProps } from "@/types/global_types";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/app/(component)/pageheader";
import { Check, Close, Edit, People } from "@mui/icons-material";
import DefaultModal from "@/app/(component)/modal";
import DefaultTextField from "@/app/(component)/defaultTextField";
import DefaultButton from "@/app/(component)/buttonDefault";
import { handleError } from "@/utils/errorHandler";
import DataTable from "@/app/(component)/datagrid";
import { mapEmployees } from "@/utils/arrayUtils";
import OptionRowLimitCount from "@/app/(component)/optionRowLimit";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  deleteEmployees: () => void;
  isLoading: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  deleteEmployees,
  isLoading,
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="w-full flex flex-col gap-1">
        <p className="text-lg font-bold">Delete Employee(s)?</p>
        <p className="text-gray-500 font-light">
          Are you sure you want to delete the selected employee(s)? This action
          cannot be undone.
        </p>
      </div>
      <div className="flex gap-1 justify-end">
        <DefaultButton
          btnText="cancel"
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
        />
        <DefaultButton
          btnText="confirm"
          disabled={isLoading}
          onClick={deleteEmployees}
        />
      </div>
    </DefaultModal>
  );
};

//edit employe modal props
interface EditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  editEmployeeForm: Partial<EmployeeProps>;
  handleEditEmployeeOnchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

//edit employee modal
const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  open,
  onClose,
  editEmployeeForm,
  handleEditEmployeeOnchange,
  handleSubmit,
  isLoading,
}) => {
  const [confirmEditEmployee, setConfirmEditEmployee] = useState(false);

  //closes also the child modal if parent was.
  useEffect(() => {
    if (!open) {
      setConfirmEditEmployee(false);
    }
  }, [open]);

  const ConfirmEditEmployeeModal = () => (
    <DefaultModal open={confirmEditEmployee}>
      <div className="flex flex-col items-center gap-1 justify-center">
        <h1 className="text-lg font-bold mb-4">Confirm Edit Employee?</h1>
        <div className="flex gap-1">
          <DefaultButton
            btnText="cancel"
            onClick={() => setConfirmEditEmployee(false)}
            variant="outlined"
            color="error"
          />
          <DefaultButton
            btnText="confirm"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );

  const handleOpenConfirmEditEmployeeModal = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setConfirmEditEmployee(true);
  };

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      className="bg-white text-gray-900"
    >
      <form onSubmit={handleOpenConfirmEditEmployeeModal}>
        <div className="flex flex-col gap-4 max-h-[36rem] overflow-auto">
          <h1 className="text-lg font-bold">Edit Employee</h1>

          {/**ID number */}
          <DefaultTextField
            name="ID_NUMBER"
            type="number"
            label="ID number"
            onChange={handleEditEmployeeOnchange}
            placeholder="ID number"
            value={
              editEmployeeForm.ID_NUMBER ? String(editEmployeeForm.ID) : ""
            }
          />

          {/**first name */}
          <DefaultTextField
            name="FIRSTNAME"
            label="First name"
            onChange={handleEditEmployeeOnchange}
            value={editEmployeeForm.FIRSTNAME || ""}
          />

          {/*Last name */}
          <DefaultTextField
            name="LASTNAME"
            label="Last name"
            onChange={handleEditEmployeeOnchange}
            value={editEmployeeForm.LASTNAME || ""}
          />

          {/*middle name */}
          <DefaultTextField
            name="MIDDLENAME"
            label="Middle name"
            onChange={handleEditEmployeeOnchange}
            value={editEmployeeForm.MIDDLENAME || ""}
          />

          {/*suffix name */}
          <DefaultTextField
            name="SUFFIX"
            label="Suffix"
            required={false}
            onChange={handleEditEmployeeOnchange}
            value={editEmployeeForm.SUFFIX || ""}
          />

          {/**edit Employee confirm buttons */}
          <div className="flex gap-1 items-end justify-end">
            <DefaultButton
              btnIcon={<Close />}
              onClick={onClose}
              variant="outlined"
              color="error"
              title="Cancel Edit Employee"
              placement="left"
            />
            <DefaultButton
              btnIcon={<Check />}
              type="submit"
              title="Confirm Edit Employee"
              placement="top"
            />
          </div>
        </div>
      </form>
      <ConfirmEditEmployeeModal />
    </DefaultModal>
  );
};

const Employee = () => {
  const { empDetails } = useAuth();
  //row limit
  const [rowLimit, setRowLimit] = useState(10);
  //router
  const router = useRouter();
  //modal state for delete confimation
  const [openDltConfMdl, setOpenDltConfMdl] = useState(false);
  //use snackbar
  const { openSnackbar } = useSnackbar();
  //department filter

  //get employees
  const { data: employees, isLoading: isEmployeeRdy } = useGetEmployeesQuery({
    departmentId: empDetails?.CURRENT_DPT_ID,
    limit: rowLimit,
  });
  //get employee count
  const { data: employeeCount } = useGetEmployeeCountQuery(
    Number(empDetails?.CURRENT_DPT_ID)
  );

  //edit employee
  const [editEmployee, { isLoading: isEditEmployeeLoading }] =
    useEditEmployeeMutation();

  //edit form
  const [editEmployeeForm, setEditEmployeeForm] = useState<
    Partial<EmployeeProps>
  >({
    ID: 0,
    ID_NUMBER: null,
    FIRSTNAME: "",
    LASTNAME: "",
    MIDDLENAME: "",
    SUFFIX: "",
    UPDATED_BY: empDetails?.ID,
  });
  //edit form modal open
  const [openEditEmployeeModal, setOpenEditEmployeeModal] = useState(false);

  // State to capture selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  //delete api

  const [deleteEmployees, { isLoading: isDeleteEmpLoading }] =
    useDeleteEmployeesMutation();

  //mapped employees
  const mappedEmployee = useMemo(() => mapEmployees(employees), [employees]);

  //edit employee handles
  //handle open edit employee modal
  const handleOpenEditEmployeeModal = (employeeDetails: EmployeeProps) => {
    const { ID, ID_NUMBER, FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
      employeeDetails;
    setEditEmployeeForm((prevFormData) => ({
      ...prevFormData,
      ID,
      ID_NUMBER,
      FIRSTNAME,
      LASTNAME,
      MIDDLENAME,
      SUFFIX,
    }));
    setOpenEditEmployeeModal(true);
  };

  //handle close edit employee modal
  const handleCloseEditEmployeeModal = () => {
    setOpenEditEmployeeModal(false);
  };

  const columns: GridColDef[] = [
    {
      field: "idNumber",
      headerName: "ID number",
      width: 150,
      editable: false,
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 220,
      editable: false,
      valueGetter: (params: string) => params.toUpperCase(),
    },
    {
      field: "department",
      headerName: "Department",
      width: 180,
    },
    {
      field: "Created",
      headerName: "Added by",
      width: 250,
      renderCell: (params) => (
        <div>
          {params.row.createdWhen === "--" ? (
            "--"
          ) : (
            <p>
              On {params.row.createdWhen} by {params.row.creator}
            </p>
          )}
        </div>
      ),
    },
    {
      field: "updater",
      headerName: "Updated",
      width: 250,
      renderCell: (params) => (
        <div>
          {params.row.updater && (
            <p>
              On {params.row.updatedWhen} by {params.row.updater}
            </p>
          )}
        </div>
      ),
    },
    {
      field: "Actions",
      width: 170,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex justify-center">
            <DefaultButton
              title="Edit this employee"
              placement="left"
              btnIcon={<Edit />}
              onClick={() =>
                //on click set employee id to edit
                handleOpenEditEmployeeModal(params.row)
              }
            />
          </div>
        );
      },
    },
  ];

  // Handle selection change
  //checkbox for delete employee
  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel as number[]);
  };

  const handleDeleteEmployees = async () => {
    try {
      const result = await deleteEmployees(selectedRows).unwrap();

      openSnackbar(result?.message || "Employees are deleted.", "success");
      setOpenDltConfMdl(false);
    } catch (error) {
      console.error(error);

      const errMsg = handleError(error, "Unable to delete employee(s).");
      openSnackbar(errMsg, "error");
    }
  };

  //handle edit employee on change
  const handleEditEmployeeOnchange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setEditEmployeeForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //handle edit employee submit
  const handleEditEmployeeSubmit = async () => {
    try {
      const result = await editEmployee({ data: editEmployeeForm }).unwrap();

      handleCloseEditEmployeeModal();

      openSnackbar(result?.message ?? "Employee has been Edited. ", "info");
    } catch (error) {
      console.error("Unable to edit employee. ", error);
      const errMsg = handleError(error, "Unable to edit employee.");
      openSnackbar(errMsg, "error");
    }
  };

  // //use effect
  useEffect(() => {
    if (employeeCount) {
      console.log("employees count ", employeeCount);
    }
  }, [employeeCount]);

  return (
    <div className="flex flex-col max-h-[520px]">
      <div className=" flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <PageHeader
            pageHead="Employees"
            icon={People}
            hasMarginBottom={false}
          />
          <OptionRowLimitCount
            totalCount={Number(employeeCount)}
            currentValue={rowLimit}
            onChange={(limit) => setRowLimit(limit)}
            className="bg-white"
          />
        </div>
        {selectedRows.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDltConfMdl(true)}
          >
            delete
          </Button>
        )}
      </div>
      <DataTable
        rows={mappedEmployee || []}
        columns={columns}
        checkboxSelection
        loading={isEmployeeRdy}
        getRowId={(row) => row.ID}
        onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) =>
          handleSelectionChange(rowSelectionModel)
        }
      />
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          onClick={() => router.push("/admin/employee/add_employee")}
        >
          add employee
        </Button>
      </div>

      {/**Delete confirmation modal */}
      <DeleteConfirmModal
        open={openDltConfMdl}
        deleteEmployees={handleDeleteEmployees}
        onClose={() => setOpenDltConfMdl(false)}
        isLoading={isDeleteEmpLoading}
      />

      {/**Edit employee modal */}
      <EditEmployeeModal
        open={openEditEmployeeModal}
        onClose={handleCloseEditEmployeeModal}
        editEmployeeForm={editEmployeeForm}
        handleEditEmployeeOnchange={handleEditEmployeeOnchange}
        handleSubmit={handleEditEmployeeSubmit}
        isLoading={isEditEmployeeLoading}
      />
    </div>
  );
};

export default Employee;
