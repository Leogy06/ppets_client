"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import Image from "next/image";
import ibs_logo from "@/assets/ibs_logo.png";
import lgu_logo from "@/assets/lgu_logo.png";
import { useCheckUserQuery, useLoginMutation } from "@/features/api/apiSlice";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  //check user
  const { data: userData } = useCheckUserQuery({});
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  const { openSnackbar } = useSnackbar();

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { user, message } = await loginUser(loginForm).unwrap();

      //redirect the user depending on the role
      switch (user.role) {
        case 1:
          router.push("/admin");
          break;
        case 2:
          router.push("/manager");
          break;
        case 3:
          router.push("/employee");
          break;
        default:
          router.push("/");

          openSnackbar("Unknown user type", "error");
      }

      openSnackbar(message || "Success login.", "info");
    } catch (error) {
      console.error(`Unable to login user - ${error}`);
      const errorMessage = (error as { data: { message: string } }).data
        .message;
      openSnackbar(errorMessage, "error");
    }
  };

  //check if user already login
  useEffect(() => {
    if (userData) {
      //redirect the user depending on the role
      switch (userData.user.role) {
        case 1:
          router.push("/admin");
          break;
        case 2:
          router.push("/manager");
          break;
        case 3:
          router.push("/employee");
          break;
        default:
          router.push("/");
          openSnackbar("Unknown user type", "error");
      }
    }
  }, [userData, openSnackbar, router]);

  return (
    <div className="flex items-center justify-center h-[38rem] p-4">
      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col justify-center gap-4 w-full md:w-96 "
      >
        <div className="flex gap-4 justify-center items-center">
          <Image
            src={lgu_logo}
            alt="lgu-logo"
            className="h-32 w-auto"
            priority
          />
          <div className="flex flex-col items-center">
            <Image
              src={ibs_logo}
              alt="ibs-logo"
              className="h-32 w-auto"
              priority
            />
            <span className="flex text-base items-baseline gap-1">
              <div className="flex items-baseline">
                <h1 className="text-green-600 font-bold text-2xl">I</h1>{" "}
                nventory
              </div>
              <div className="flex items-baseline">
                <h1 className="text-blue-600 font-bold text-2xl">B</h1>orrowing{" "}
              </div>
              <div className="flex items-baseline">
                <h1 className="text-yellow-600 font-bold text-2xl">S</h1>ystem
              </div>
            </span>
          </div>
        </div>
        <TextField
          label="Username"
          name="username"
          onChange={handleChangeForm}
          disabled={isLoading}
          required
        />
        <TextField
          label="Password"
          name="password"
          onChange={handleChangeForm}
          type="password"
          required
        />
        <Button variant="contained" type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "login"}
        </Button>
        <Button variant="text" disabled={isLoading}>
          Forgot Password
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
