import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  credentials: "include", // allows sending cookies (if using JWT cookies)
  prepareHeaders: (headers) => {
    // Optional: Add auth token if stored in localStorage/sessionStorage
    // const token = localStorage.getItem("access_token");
    // if (token) {
    //   headers.set("Authorization", `Bearer ${token}`);
    // }
    return headers;
  },
});
