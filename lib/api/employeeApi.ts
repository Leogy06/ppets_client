import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "employeeApi",
  baseQuery,
  tagTypes: ["Employee"],

  endpoints: (builder) => ({
    getAllEmployee: builder.query({
      query: () => "/employee",
      providesTags: ["Employee"],
    }),
  }),
});

export const { useGetAllEmployeeQuery } = authApi;
