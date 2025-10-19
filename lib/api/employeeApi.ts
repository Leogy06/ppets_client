import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
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
