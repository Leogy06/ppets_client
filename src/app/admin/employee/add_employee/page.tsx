"use client";

import { useSnackbar } from "@/context/GlobalSnackbar";
import { useAddEmployeeMutation, useGetDepartmentQuery } from "@/state/api";
import {
  Autocomplete,
  Button,
  CircularProgress,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddEmployee = () => {
  const router = useRouter();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  const [formValues, setFormValues] = useState({
    ID_NUMBER: "",
    FIRSTNAME: "",
    MIDDLENAME: "",
    LASTNAME: "",
    SUFFIX: "",
    DEPARTMENT_ID: "",
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

  const handleChangeDepartment = (e: SelectChangeEvent) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      DEPARTMENT_ID: e.target.value,
    }));
  };

  //submit form

  //get department
  const { data: departments, isLoading: isDptRdy } = useGetDepartmentQuery();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await addEmployee(formValues).unwrap();
      openSnackbar(result?.message || "Employee Added", "success");
    } catch (error) {
      console.error(error);
      const errorMessage = (error as { data: { message: string } }).data
        .message;
      openSnackbar(errorMessage, "error");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <form
          onSubmit={handleSubmit}
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

          <Autocomplete
            className="w-full md:w-96"
            options={departments || []}
            getOptionLabel={(option) => option.DEPARTMENT_NAME || ""}
            onChange={(_, newValue) => {
              if (newValue) {
                handleChangeDepartment({
                  target: {
                    value: String(newValue.ID),
                    name: "DEPARTMENT_ID",
                  } as EventTarget & HTMLInputElement,
                } as SelectChangeEvent);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Department ID" variant="outlined" />
            )}
            loading={isDptRdy}
            loadingText={<CircularProgress size={20} />}
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
    </>
  );
};

export default AddEmployee;
