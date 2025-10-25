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
  tagTypes: ["Employee"],

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
    addEmployee:builder.mutation({
      query:(body) => ({
        url:"/api/employee",
        method:"POST",
        body
      }),
      invalidatesTags:["Employee"]
    })
  }),
});

export const { useGetAllEmployeeQuery, useAddEmployeeMutation } = employeeApi;
