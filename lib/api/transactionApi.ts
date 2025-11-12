import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Status, Transaction } from "@/types";
import { CreateTransactionDto } from "@/types/dto";

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
    approveTransaction: builder.mutation<void, { transactionId: string }>({
      query: ({ transactionId }) => ({
        url: `/api/transaction/approve-transaction/${transactionId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Transactions"],
    }),

    //reject transaction
    rejectTransaction: builder.mutation<void, { transactionId: string }>({
      query: ({ transactionId }) => ({
        url: `/api/transaction/reject-transaction/${transactionId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Transactions"],
    }),

    createTransaction: builder.mutation<void, CreateTransactionDto>({
      query: (dto) => ({
        url: "/api/transaction",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Transactions"],
    }),

    //get aproved transaction
    getApprovedTransaction: builder.query<Transaction[], void>({
      query: () => "/api/transaction/approved-employee",
      providesTags: ["Transactions"],
    }),

    //use get employee transactions
    getEmployeeTransaction: builder.query<
      { transactions: Transaction[]; count: number },
      void
    >({
      query: () => "/api/transaction/employee-transactions",
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useCreateTransactionMutation,

  //for admin
  useGetTransactionQuery,

  //update transaction
  // approve
  useApproveTransactionMutation,
  // reject
  useRejectTransactionMutation,

  useGetApprovedTransactionQuery,

  //for employee transactions
  useGetEmployeeTransactionQuery,
} = transactionApi;
