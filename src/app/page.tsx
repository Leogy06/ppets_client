"use client";

import React from "react";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import ibs_logo from "@/assets/ibs.png";
import lgu_logo from "@/assets/lgu_logo.png";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-[38rem] ">
      <div className="flex flex-col justify-center gap-4 w-full md:w-96 ">
        <div className="flex gap-4 justify-center">
          <Image src={lgu_logo} alt="lgu-logo" className="h-32 w-auto" />
          <Image src={ibs_logo} alt="ibs-logo" className="h-32 w-auto" />
        </div>
        <TextField label="Username" name="username" />
        <TextField label="Password" name="password" />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#375ba5" }}
          onClick={() => router.push("/admin")}
        >
          Login
        </Button>
        <Button variant="text">Forgot Password</Button>
      </div>
    </div>
  );
};

export default LoginPage;
