import { miniSerializeError } from "@reduxjs/toolkit";
import { User } from ".";

export type LoginResponseDto = {
  message: string;
  user: User;
};
export type InputLoginDto = {
  username: string;
  password: string;
};

miniSerializeError;
