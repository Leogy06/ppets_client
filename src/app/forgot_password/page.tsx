"use client";

import React from "react";
import BackArrow from "@/app/(component)/backArrow";

const ForgotPassword = () => {
  return (
    <>
      <h1 className="flex gap-2 items-center">
        <BackArrow />
        Forgot Password
      </h1>
      <p className="flex justify-center text-center animate-pulse">
        Coming soon...
      </p>
    </>
  );
};

export default ForgotPassword;
