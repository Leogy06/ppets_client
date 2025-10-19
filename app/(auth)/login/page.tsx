"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { extractedError } from "@/utils/errorExtractor";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

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
      await login(formData).unwrap();
      // * todo redirect to dashboard
      // router.push/admin
    } catch (error) {
      setErrors(extractedError(error));
    }
  };
  return (
    <form
      onSubmit={handleSubmitLogin}
      className="flex flex-col w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-lg"
    >
      <h2 className="text-center">Property Plant & Equipment Tracking</h2>

      <div className="flex flex-col gap-3 mt-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
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
          />
        </div>
      </div>

      <Button type="submit" className="mt-4" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {errors && (
        <p className="text-center text-red-400 my-4 text-sm">{errors}</p>
      )}

      <p className="text-sm text-center text-muted-foreground mt-2">
        Powered by City Accountant's Office
      </p>
    </form>
  );
};

export default Login;
