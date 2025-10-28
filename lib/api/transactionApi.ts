import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Status, Transaction } from "@/types";

interface RespondTransactionDto {
  transactions: Transaction[];
  count: number;
}
interface GetTransactionDto {
  pageSize: number;
  pageIndex: number;
}

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery,
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    getTransaction: builder.query<RespondTransactionDto, GetTransactionDto>({
      query: ({ pageIndex, pageSize }) =>
        `/api/transaction/${pageSize}/${pageIndex}`,
      providesTags: ["Transactions"],
    }),

    //update transaction
    updateStatus: builder.mutation<
      void,
      { status: Status; transactionId: string }
    >({
      query: ({ transactionId, status }) => ({
        url: `/api/transaction/update-status/${transactionId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const { useGetTransactionQuery, useUpdateStatusMutation } =
  transactionApi;
