"use client";

import React, { useState } from "react";
import PageHeader from "@/app/(component)/pageheader";
import DefaultTextField from "@/app/(component)/defaultTextField";
import { User } from "@/types/global_types";
import DefaultButton from "@/app/(component)/buttonDefault";
import { useAddUserMutation } from "@/features/api/apiSlice";
import DefaultModal from "@/app/(component)/modal";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useParams, useRouter } from "next/navigation";
import { handleError } from "@/utils/errorHandler";

//confirm add user modal
const ConfirmAddUserModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  return (
    <DefaultModal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Confirm Add User</h1>
        <p>Are you sure you want to add this user?</p>
        <div className="flex justify-end">
          <DefaultButton
            btnText="No"
            variant="text"
            onClick={onClose}
            disabled={isLoading}
          />

          <DefaultButton
            btnText="Yes"
            onClick={onSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </DefaultModal>
  );
};

const Register = () => {
  //params
  const { emp_id } = useParams();

  const [registerForm, setRegisterForm] = useState<Partial<User>>({
    username: "",
    password: "",
    email: "",
    role: 2,
    emp_id: Number(emp_id),
  });

  //confirm add user modal
  const [isConfirmAddUserModal, setIsConfirmAddUserModal] = useState(false);

  const { openSnackbar } = useSnackbar();

  const [addUser, { isLoading: isAddUserLoading }] = useAddUserMutation();

  //router
  const router = useRouter();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  //submit form
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //add register api here
    setIsConfirmAddUserModal(true);
  };

  //submit add user
  const handleAddUser = async () => {
    try {
      const result = await addUser(registerForm).unwrap();

      console.log("result ", result);

      setIsConfirmAddUserModal(false);
      openSnackbar("User added successfully.", "success");
      router.push("/");
    } catch (error) {
      console.error("Unable to add user. - ", error);
      const errMsg = handleError(error, "Unable to add user.");
      openSnackbar(errMsg, "error");
    }
  };

  return (
    <>
      <PageHeader pageHead="Register" />
      <form onSubmit={handleSubmitForm}>
        <div className="flex flex-col gap-4 ">
          <DefaultTextField
            label="Emp ID"
            name="emp_id"
            onChange={handleOnchange}
            value={registerForm.emp_id ? String(registerForm.emp_id) : ""}
            required
            disabled={true}
          />
          <DefaultTextField
            label="Username"
            name="username"
            onChange={handleOnchange}
            value={registerForm.username}
            required
          />
          <DefaultTextField
            label="Password"
            name="password"
            type="password"
            onChange={handleOnchange}
            value={registerForm.password}
            required
          />
          <DefaultTextField
            label="Email"
            name="email"
            onChange={handleOnchange}
            value={registerForm.email}
            required
          />
          <div className="flex justify-end">
            <DefaultButton
              btnText="cancel"
              variant="text"
              onClick={() => router.push("/")}
            />
            <DefaultButton btnText="register" type="submit" />
          </div>
        </div>
      </form>
      <ConfirmAddUserModal
        open={isConfirmAddUserModal}
        onClose={() => setIsConfirmAddUserModal(false)}
        isLoading={isAddUserLoading}
        onSubmit={handleAddUser}
      />
    </>
  );
};

export default Register;
