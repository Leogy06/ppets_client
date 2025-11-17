"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { checkUserRole } from "@/utils/checkUserRole";
import { extractedError } from "@/utils/errorExtractor";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useDispatch } from "react-redux";

const Login = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState("");

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors("");
    const { value, name } = e.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();

      //sotre in the local storage using redux

      dispatch(
        setCredentials({
          employee: response.employee,
          user: response.user,
          message: response.message,
        })
      );

      // * todo redirect to dashboard
      checkUserRole(response.user, router, startTransition);

      //store the role
    } catch (error) {
      setErrors(extractedError(error));
    }
  };
  return (
    <form
      onSubmit={handleSubmitLogin}
      className="flex flex-col w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-lg"
    >
      {/* Header (Logo + Text) */}
      <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:text-left sm:justify-center">
        <Image
          src={"/logo.png"}
          alt="PPETS Logo"
          width={400}
          height={300}
          priority={false}
          placeholder="blur"
          blurDataURL="/blur_logo.png"
          className="rounded-full"
          unoptimized
        />
        <h3 className="text-lg sm:text-xl font-semibold text-accent-foreground/50 leading-tight">
          Property, Plant & Equipment
          <br />
          <span className="text-blue-600">Tracking System</span>
        </h3>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            disabled={isLoading}
            id="username"
            type="text"
            name="username"
            value={formData.username}
            placeholder="Enter your username"
            required
            onChange={handleOnchange}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            required
            onChange={handleOnchange}
            disabled={isLoading}
          />
        </div>
      </div>

      {errors && (
        <p className="text-center text-red-400 my-4 text-sm">{errors}</p>
      )}

      <Button type="submit" className="mt-4" disabled={isLoading || isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
      <div className="flex items-center justify-center my-4">
        <hr className="border w-full" />
      </div>

      <p className="text-center text-muted-foreground">
        No account? Ask your department admin to have one.
      </p>

      <p className="text-sm text-center text-muted-foreground mt-8">
        Powered by City Accountant&apos;s Office
      </p>
    </form>
  );
};

export default Login;
