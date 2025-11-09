import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Items } from "@/types";
import { CreateItemDto, GetitemDto } from "@/types/dto";

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery,
  tagTypes: ["Items", "AvailableItems"],
  endpoints: (builder) => ({
    getItems: builder.query<{ items: Items[]; count: number }, GetitemDto>({
      query: ({ pageIndex, pageSize, itemName }) => {
        const endpoint = itemName
          ? `?itemName=${encodeURIComponent(itemName)}`
          : "";
        return `/api/items/${pageIndex}/${pageSize}${endpoint}`;
      },

      providesTags: ["Items"],
    }),
    createItem: builder.mutation<void, CreateItemDto>({
      query: (body) => ({
        url: "api/items",
        method: "POST",
        body: {
          ...body,
          UNIT_VALUE: Number(body.UNIT_VALUE), // avoid type data conflict
        },
      }),
      invalidatesTags: ["Items"],
    }),
    updateItem: builder.mutation<void, Partial<CreateItemDto>>({
      query: (updateItemDto) => ({
        url: `/api/items/${updateItemDto.ID}`,
        method: "PUT",
        body: updateItemDto,
      }),
      invalidatesTags: ["Items"],
    }),

    getAvailableItems: builder.query<
      { availableItems: Items[]; itemCount: number },
      void
    >({
      query: () => "/api/items/available-items",
      providesTags: ["AvailableItems"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useGetAvailableItemsQuery,
} = itemsApi;
