import { miniSerializeError } from "@reduxjs/toolkit";
import { User } from ".";

export type LoginResponse = {
  data: {
    message: string;
    user: User;
    token: string;
  };
};
export type InputLoginDto = {
  username: string;
  password: string;
};

miniSerializeError;
