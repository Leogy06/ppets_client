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
    createUserEmployee: builder.mutation<void, { empId: number; role: number }>(
      {
        query: ({ empId, role }) => ({
          url: `/api/user/create/user-employee`,
          method: "POST",
          body: {
            empId,
            role,
          },
        }),
        invalidatesTags: ["UserEmployee"],
      }
    ),
  }),
});

export const {
  useGetUserEmployeeQuery,
  useUpdateUserActiveStatusMutation,
  useCreateUserEmployeeMutation,
} = userApi;
