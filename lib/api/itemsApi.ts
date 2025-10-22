import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Items } from "@/types";

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery,
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    getItems: builder.query<Items[], void>({
      query: () => "/api/items",
      providesTags: ["Items"],
    }),
  }),
});

export const { useGetItemsQuery } = itemsApi;
