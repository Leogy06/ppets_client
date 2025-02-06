import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface EmployeeProps {
  ID: number;
  ID_NUMBER?: number;
  FIRSTNAME?: string;
  MIDDLENAME?: string;
  LASTNAME?: string;
  SUFFIX?: string;
  DEPARTMENT_ID?: number;
  CURRENT_DEPARTMENT?: number;
  CREATED_BY?: number;
  CREATED_WHEN?: Date;
  UPDATED_BY?: number;
  UPDATED_WHEN?: Date;
  DELETED?: number;
}

export interface DepartmentProps {
  ID: number;
  DEPARTMENT_NAME: string;
  CODE: string;
  DESCRIPTION?: string;
  OFFICER: string;
  POSITION: string;
  ENTRY_DATE: Date;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  }),
  tagTypes: ["Employees", "Departments"],

  //employee api
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeProps[], number>({
      query: (department) => `/employees?department=${department}`,
      providesTags: ["Employees"],
    }),
    addEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),
    editEmployee: builder.mutation({
      query: ({ data, id }) => ({
        url: `/employees?ID=${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    //department api
    getDepartment: builder.query<DepartmentProps[], void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetDepartmentQuery,
  useAddEmployeeMutation,
} = apiSlice;
