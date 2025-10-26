import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Employee, User } from "@/types";

interface GetUserEmployeeDto {
  employee: Employee;
  userProfiles: User[];
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["UserEmployee"],
  endpoints: (builder) => ({
    getUserEmployee: builder.query<GetUserEmployeeDto, number>({
      query: (empId) => ({
        url: `/api/user/user-employee/${empId}`,
      }),
      providesTags: ["UserEmployee"],
    }),
  }),
});

export const { useGetUserEmployeeQuery } = userApi;
