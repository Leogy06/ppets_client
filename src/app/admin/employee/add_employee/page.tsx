"use client";

import DefaultButton from "@/app/(component)/buttonDefault";
import DefaultModal from "@/app/(component)/modal";
import PageHeader from "@/app/(component)/pageheader";
import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useAddEmployeeMutation } from "@/features/api/apiSlice";
import { Employee } from "@/types/global_types";
import { People } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

//add employee confirmation

const ConfirmAddEmployee = ({
  open,
  onClose,
  onSubmit,
  formData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: Partial<Employee>;
}) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      className={`${
        isDarkMode ? "bg-gray-900 text-gray-50" : " bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="font-semibold text-lg text-center">
          Confirm Add Employee?
        </h1>
        {formData && (
          <div className="flex flex-col gap-4">
            <p>
              Id number |
              <span className="font-medium">{formData.ID_NUMBER}</span>
            </p>
            <p>
              FIRSTNAME |
              <span className="font-medium text-lg">{formData.FIRSTNAME}</span>
            </p>
            <p>
              MIDDLENAME |
              <span className="font-medium text-lg">
                {formData.MIDDLENAME ?? "--"}
              </span>
            </p>
            <p>
              LASTNAME |
              <span className="font-medium text-lg">{formData.LASTNAME}</span>
            </p>
            <p>
              SUFFIX |
              <span className="font-medium text-lg">
                {formData.SUFFIX ?? "--"}
              </span>
            </p>
            <p>
              LASTNAME |
              <span className="font-medium text-lg">{formData.LASTNAME}</span>
            </p>
          </div>
        )}
        <div className="flex gap-1">
          <DefaultButton onClick={onClose} variant="text" btnText="cancel" />
          <DefaultButton
            onClick={onSubmit}
            btnIcon="confirm"
            title="Click to add."
            placement="top"
          />
        </div>
      </div>
    </DefaultModal>
  );
};

const AddEmployee = () => {
  const { empDetails } = useAuth();
  const router = useRouter();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  const [formValues, setFormValues] = useState<Partial<Employee>>({
    ID_NUMBER: 0,
    FIRSTNAME: "",
    MIDDLENAME: "",
    LASTNAME: "",
    SUFFIX: "",
    DEPARTMENT_ID: empDetails?.CURRENT_DPT_ID,
    CREATED_BY: empDetails?.ID,
    UPDATED_BY: empDetails?.ID,
  });

  //add employee
  const [addEmployee] = useAddEmployeeMutation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  //use state
  //open confirmation add employee
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setOpenConfirmation(true);
  };

  const handleSubmit = async () => {
    try {
      const result = await addEmployee(formValues).unwrap();
      openSnackbar(result?.message || "Employee Added", "success");
      setOpenConfirmation(false);
      router.push("/admin/employee");
    } catch (error) {
      console.error(error);
      const errorMessage = (error as { data: { message: string } }).data
        .message;
      openSnackbar(errorMessage, "error");
    }
  };

  return (
    <>
      <PageHeader pageHead="Add Employee" icon={People} />
      <div className="flex items-center justify-center w-full">
        <form
          onSubmit={handleSubmitForm}
          className="flex flex-col gap-4 w-full md:w-96"
        >
          <TextField
            label="ID number"
            name="ID_NUMBER"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="First name"
            name="FIRSTNAME"
            required
            onChange={handleInputChange}
          />
          <TextField
            placeholder="Optional"
            label="Middle name"
            name="MIDDLENAME"
            onChange={handleInputChange}
          />
          <TextField
            label="Last name"
            name="LASTNAME"
            required
            onChange={handleInputChange}
          />
          <TextField
            label="Suffix"
            name="SUFFIX"
            onChange={handleInputChange}
          />
          <div className=" flex flex-col">
            <Button variant="contained" type="submit">
              Submit
            </Button>
            <Button type="reset" onClick={() => router.push("/admin/employee")}>
              cancel
            </Button>
          </div>
        </form>
      </div>
      <ConfirmAddEmployee
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={handleSubmit}
        formData={formValues}
      />
    </>
  );
};

export default AddEmployee;
