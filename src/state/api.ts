import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ProductProps {
  ID: number;
  ID_NUMBER?: number;
  FIRSTNAME?: string;
  MIDDLENAME?: string;
  LASTNAME?: string;
  SUFFIX?: string;
  DEPARTMENT_ID?: number;
  DETAILED_DEPARTMENT_ID?: number;
  CREATED_BY?: number;
  CREATED_WHEN?: Date;
  UPDATED_BY?: number;
  UPDATED_WHEN?: Date;
  DELETED?: number;
}
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  }),
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query<ProductProps[], void>({
      query: () => "/employees",
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetEmployeesQuery } = apiSlice;
