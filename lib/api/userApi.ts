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
    updateUserActiveStatus: builder.mutation<
      void,
      { userId: number; activeStatus: number }
    >({
      query: ({ userId, activeStatus }) => ({
        url: `/api/user/update/active-status/${userId}`,
        method: "PUT",
        body: {
          activeStatus,
        },
      }),
      invalidatesTags: ["UserEmployee"],
    }),
  }),
});

export const { useGetUserEmployeeQuery, useUpdateUserActiveStatusMutation } =
  userApi;
