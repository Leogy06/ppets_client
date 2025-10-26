import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Employee } from "@/types";

interface GetEmployeeDto {
  pageIndex: number;
  pageSize: number;
  employeeName: string;
}

interface ReceivedEmployeeDto {
  count: number;
  employees: Employee[];
}

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery,
  tagTypes: ["Employee", "ArchivedEmployee"],

  endpoints: (builder) => ({
    getAllEmployee: builder.query<ReceivedEmployeeDto, GetEmployeeDto>({
      query: ({ pageIndex, pageSize, employeeName }) => {
        let url = `/api/employee/${pageIndex}/${pageSize}`;

        if (employeeName) {
          url += `?employeeName=${encodeURIComponent(employeeName)}`;
        }

        return url;
      },
      providesTags: ["Employee"],
    }),
    addEmployee: builder.mutation<void, Partial<Employee>>({
      query: (body) => ({
        url: "/api/employee",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
    deleteEmployee: builder.mutation<void, number>({
      query: (employeeId) => ({
        url: `/api/employee/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee", "ArchivedEmployee"],
    }),
    getAllArchivedEmployee: builder.query<ReceivedEmployeeDto, GetEmployeeDto>({
      query: ({ pageIndex, pageSize, employeeName }) => {
        let url = `/api/employee/archived/${pageIndex}/${pageSize}`;

        if (employeeName) {
          url += `?employeeName=${encodeURIComponent(employeeName)}`;
        }

        return url;
      },
      providesTags: ["ArchivedEmployee"],
    }),
    restoreEmployee: builder.mutation<void, number>({
      query: (employeeId) => ({
        url: `/api/employee/restore/${employeeId}`,
        method: "PUT",
      }),
      invalidatesTags: ["ArchivedEmployee", "Employee"],
    }),
  }),
});

export const {
  useGetAllEmployeeQuery,
  useGetAllArchivedEmployeeQuery,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useRestoreEmployeeMutation,
} = employeeApi;
