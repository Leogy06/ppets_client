import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { AccountCode } from "@/types";

export const accountCodeApi = createApi({
  reducerPath: "accountCodeApi",
  baseQuery,
  tagTypes: ["AccountCodes"],
  endpoints: (builder) => ({
    findAllAccountCodes: builder.query<AccountCode[], void>({
      query: () => "/api/account-codes",
      providesTags: ["AccountCodes"],
    }),
  }),
});

export const { useFindAllAccountCodesQuery } = accountCodeApi;
