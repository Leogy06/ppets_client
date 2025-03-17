"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import Image from "next/image";
import lgu_logo from "@/assets/lgu_logo.png";
import adts_logo from "@/assets/images/adts.png";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { socket } from "@/hooks/useSocket";
import DefaultButton from "./(component)/buttonDefault";
import { useFirstTimeLoginMutation } from "@/features/api/apiSlice";
import { useSnackbar } from "@/context/GlobalSnackbar";
import { handleError } from "@/utils/errorHandler";

const LoginPage = () => {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [firstTimeLogin, setFirstTimeLogin] = useState(false);

  //check user

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  //auth context
  const { loginUser, user, isLoading, empDetails } = useAuth();

  //check if first time login
  const [firstTimeLoginApi] = useFirstTimeLoginMutation();

  //use snackbar
  const { openSnackbar } = useSnackbar();

  /**
   * Handle form submission
   * @param e form event
   */
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("loginForm ", loginForm);

    //check if first time login
    if (loginForm.username === loginForm.password) {
      try {
        console.log("first time login detected");

        //call api to check if id is first time login
        const result = await firstTimeLoginApi(loginForm.username).unwrap();

        console.log("result ", result);

        //check if the input id has in employee
        if (result?.firstTimeLogin) {
          console.log("first time login detected");

          //redirect to register page
          router.push(`/register/${loginForm.username}`);
          //show snackbar message
          openSnackbar(result.message, "info");
          return;
        }
        //show snackbar message
        openSnackbar(result.message, "error");
        return;
      } catch (error) {
        const errMsg = handleError(error, "Unable to check first time login.");
        openSnackbar(errMsg, "error");
        console.error("error ", errMsg);
        return; // necessary to display error
      }
    }

    //login user
    console.log("login user");

    loginUser(loginForm);
  };

  //check if user login
  useEffect(() => {
    if (user) {
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
          break;
      }
    }
  }, [user, router]);

  //show loading page when fetching
  useEffect(() => {
    if (empDetails) {
      socket.emit("registerUser", empDetails.ID);
    }
  }, [empDetails]);

  return (
    <div className="flex flex-col items-center justify-center h-[38rem] p-4">
      {firstTimeLogin ? (
        <form>
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex gap-4 justify-center items-center">
              <Image
                src={lgu_logo}
                alt="lgu-logo"
                className="h-32 w-auto"
                priority
              />
              <div className="flex flex-col items-center">
                <Image
                  src={adts_logo}
                  alt="ibs-logo"
                  className="h-32 w-auto"
                  priority
                />
                <span className="flex text-base items-baseline gap-1">
                  <div className="flex items-baseline">
                    <h1 className="text-green-600 font-bold text-2xl">A</h1>{" "}
                    ssets
                  </div>
                  <div className="flex items-baseline">
                    <h1 className="text-blue-600 font-bold text-2xl">D</h1>
                    istribution
                  </div>
                  &
                  <div className="flex items-baseline">
                    <h1 className="text-yellow-600 font-bold text-2xl">T</h1>
                    tracking
                  </div>
                  <div className="flex items-baseline">
                    <h1 className="text-amber-600 font-bold text-2xl">S</h1>
                    ystem
                  </div>
                </span>
              </div>
            </div>
            <TextField
              label="ID Number"
              name="ID_NUMBER"
              onChange={handleChangeForm}
              required
              fullWidth
            />
            <DefaultButton
              variant="contained"
              color="primary"
              btnText="Check"
              onClick={() => console.log("check")}
            />
          </div>
        </form>
      ) : (
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
                src={adts_logo}
                alt="ibs-logo"
                className="h-32 w-auto"
                priority
              />
              <span className="flex text-base items-baseline gap-1">
                <div className="flex items-baseline">
                  <h1 className="text-green-600 font-bold text-2xl">A</h1> ssets
                </div>
                <div className="flex items-baseline">
                  <h1 className="text-blue-600 font-bold text-2xl">D</h1>
                  istribution
                </div>
                &
                <div className="flex items-baseline">
                  <h1 className="text-yellow-600 font-bold text-2xl">T</h1>
                  tracking
                </div>
                <div className="flex items-baseline">
                  <h1 className="text-amber-600 font-bold text-2xl">S</h1>ystem
                </div>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <TextField
              label="Username"
              name="username"
              onChange={handleChangeForm}
              disabled={isLoading}
              required
              fullWidth
              placeholder="Use ID Number for first time login"
            />
            <TextField
              label="Password"
              name="password"
              onChange={handleChangeForm}
              type="password"
              required
              fullWidth
              placeholder="Use ID Number for first time login"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} /> : "login"}
            </Button>
            <Button variant="text" disabled={isLoading}>
              Forgot Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
