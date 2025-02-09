"use client";
import {
  EmployeeProps,
  useDeleteEmployeesMutation,
  useEditEmployeeMutation,
  useGetDepartmentQuery,
  useGetEmployeesQuery,
} from "@/features/api/apiSlice";
import { dateFormmater } from "@/utils/date_formmater";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { ErrorParams } from "@/types/global_types";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  deleteEmployees: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  deleteEmployees,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-[300px] bg-white rounded-2xl flex flex-col items-center justify-center gap-5 p-7 shadow-lg relative">
          <div className="w-full flex flex-col gap-1">
            <p className="text-lg font-bold text-gray-900">
              Delete Employee(s)?
            </p>
            <p className="text-gray-500 font-light">
              Are you sure you want to delete the selected employee(s)? This
              action cannot be undone.
            </p>
          </div>
          <div className="w-full flex items-center justify-center gap-2">
            <button
              onClick={onClose}
              className="w-1/2 h-9 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={deleteEmployees}
              className="w-1/2 h-9 rounded-lg bg-red-400 text-white hover:bg-red-500 font-semibold"
            >
              Delete
            </button>
          </div>
          <button
            className="absolute top-5 right-5 flex items-center justify-center bg-transparent hover:text-black"
            onClick={onClose}
          >
            <svg
              height="20px"
              viewBox="0 0 384 512"
              className="fill-gray-400 hover:fill-black"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Employee = () => {
  //router
  const router = useRouter();
  //modal state for delete confimation
  const [openDltConfMdl, setOpenDltConfMdl] = useState(false);
  //use snackbar
  const { openSnackbar } = useSnackbar();
  //department filter
  const [departmentID, setDepartmentID] = useState(1);

  //get employees

  const {
    data: employees,
    isLoading: isEmployeeRdy,
    isError: isEmployeeErr,
  } = useGetEmployeesQuery(departmentID);

  //get department
  const { data: departments, isLoading: isDptRdy } = useGetDepartmentQuery();

  //edit employee
  const [editEmployee] = useEditEmployeeMutation();

  // State to capture selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  //delete api

  const [deleteEmployees] = useDeleteEmployeesMutation();

  const columns: GridColDef[] = [
    { field: "ID_NUMBER", headerName: "ID number", width: 150, editable: true },
    { field: "LASTNAME", headerName: "Last Name", width: 150, editable: true },
    {
      field: "FIRSTNAME",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    {
      field: "MIDDLENAME",
      headerName: "Middle Name",
      width: 150,
      editable: true,
    },
    { field: "SUFFIX", headerName: "Suffix", width: 100, editable: true },
    { field: "CURRENT_DEPARTMENT" },
    { field: "CREATED_BY", headerName: "Added by", width: 150 },
    {
      field: "CREATED_WHEN",
      headerName: "Created When",
      width: 200,
      type: "date",
      valueFormatter: (param) => dateFormmater(param as string),
    },
    { field: "UPDATED_BY", headerName: "Updated By", width: 150 },
    {
      field: "UPDATED_WHEN",
      headerName: "Updated When",
      width: 200,
      type: "date",
      valueFormatter: (param) => dateFormmater(param as string),
    },
  ];

  //handle row edit
  const handleRowEdit = async (newRow: EmployeeProps) => {
    const { ID, ...updatedFields } = newRow;
    try {
      await editEmployee({ data: updatedFields, id: ID });

      return { ...newRow };
    } catch (error) {
      console.error(error);
      return { ...employees?.find((row) => row.ID === ID) };
    }
  };

  // Handle selection change
  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel as number[]);
  };

  const handleDeleteEmployees = async () => {
    try {
      const result = await deleteEmployees(selectedRows).unwrap();

      openSnackbar(result?.message || "Employees are deleted.", "success");
      setOpenDltConfMdl(false);
    } catch (error: unknown) {
      console.error(error);
      openSnackbar(
        (error as ErrorParams)?.response?.message ||
          "Unable to Delete employee(s)",
        "error"
      );
    }
  };

  if (isEmployeeRdy) {
    return <p className="animate-pulse">Loading...</p>;
  }

  if (isEmployeeErr) {
    return <p className="text-red-500">Error loading data...</p>;
  }

  return (
    <>
      <div className=" flex justify-end mb-4">
        {isDptRdy ? (
          <span className="animate-pulse text-gray-300">
            Loading department options...
          </span>
        ) : selectedRows.length <= 0 ? (
          <Autocomplete
            className="w-full md:w-96"
            options={departments || []}
            getOptionLabel={(option) => option.DEPARTMENT_NAME || ""}
            value={departments?.find((d) => d.ID === departmentID) || null}
            onChange={(_, newValue) => {
              if (newValue) {
                setDepartmentID(newValue.ID);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Department ID" variant="outlined" />
            )}
            loading={isDptRdy}
            loadingText={<CircularProgress size={20} />}
          />
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDltConfMdl(true)}
          >
            delete
          </Button>
        )}
      </div>
      <Paper sx={{ height: 400, width: "100%", marginBottom: "1rem" }}>
        <DataGrid
          rows={employees}
          columns={columns}
          processRowUpdate={(newRow) => handleRowEdit(newRow)}
          checkboxSelection
          getRowId={(row) => row.ID}
          onRowSelectionModelChange={(rowSelectionModel) =>
            handleSelectionChange(rowSelectionModel as number[])
          }
        />
      </Paper>
      <div className="flex justify-end">
        <Button
          variant="contained"
          onClick={() => router.push("/admin/employee/add_employee")}
        >
          add employee
        </Button>
      </div>

      {/**Delete confirmatio modal */}
      <DeleteConfirmModal
        open={openDltConfMdl}
        deleteEmployees={handleDeleteEmployees}
        onClose={() => setOpenDltConfMdl(false)}
      />
    </>
  );
};

export default Employee;
