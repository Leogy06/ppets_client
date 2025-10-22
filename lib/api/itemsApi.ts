import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Items } from "@/types";
import { GetitemDto } from "@/types/dto";

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery,
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    getItems: builder.query<Items[], GetitemDto>({
      query: ({ page, pageSize }) => `/api/items/${page}/${pageSize}`,
      providesTags: ["Items"],
    }),
  }),
});

export const { useGetItemsQuery } = itemsApi;
