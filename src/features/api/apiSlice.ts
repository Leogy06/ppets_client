import { Department, Employee, Item } from "@/types/global_types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: [
    "Employees",
    "Departments",
    "User",
    "Items",
    "ItemCategories",
    "BorrowingTransaction",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/auth/api/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/auth/api/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    //employee api
    getEmployees: builder.query<Employee[], number>({
      query: (department) => `/employees?department=${department}`,
      providesTags: ["Employees"],
    }),
    addEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),
    editEmployee: builder.mutation({
      query: ({ data, id }) => ({
        url: `/employees?ID=${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),
    deleteEmployees: builder.mutation({
      query: (IDs: number[]) => ({
        url: `/employees/delete?DELETED=1`, //change lang 0 kung mag revert
        method: "DELETE",
        body: { IDs },
      }),
      invalidatesTags: ["Employees"],
    }),
    getEmployeeById: builder.query<Employee, string>({
      query: (empId) => `/employees/${empId}`,
      providesTags: ["Employees"],
    }),

    //department api
    getDepartment: builder.query<Department[], void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),

    //user
    checkUser: builder.query({
      query: () => "/user/auth/api/checkuser",
      providesTags: ["User"],
    }),

    //items
    //view
    getItems: builder.query<Item[], void>({
      query: () => "/item",
      providesTags: ["Items"],
    }),

    //add
    addItem: builder.mutation({
      query: (data) => ({
        url: "/item",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Items"],
    }),
    //edit
    editItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/item/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Items"],
    }),

    //get items by owner
    getItemsByOwner: builder.query({
      query: (empId) => `/item/${empId}`,
      providesTags: ["Items"],
    }),

    //delete item
    deleteItems: builder.mutation({
      query: ({ ids }) => ({
        url: "/item",
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Items"],
    }),

    //item category
    getItemCategories: builder.query({
      query: () => "/item-category",
      providesTags: ["ItemCategories"],
    }),
    addCategoryItem: builder.mutation({
      query: (data) => ({
        url: "/item-category",
        method: "POST",
        body: { description: data },
      }),
    }),
    editCategoryItem: builder.mutation({
      query: ({ id, description }) => ({
        url: `/item-category/${id}`,
        method: "PUT",
        body: { description },
      }),
    }),

    //borrowing
    addBorrowingTransaction: builder.mutation({
      query: ({ borrowedItems, borrower, owner }) => ({
        url: `/borrowing?owner=${owner}&borrower=${borrower}`,
        method: "POST",
        body: { borrowedItems },
      }),
      invalidatesTags: ["BorrowingTransaction", "Items"],
    }),
    getBorrowingTransactionByBorrower: builder.query({
      query: ({ empId }) => ({
        url: `/borrowing/borrower?empId=${empId}`,
      }),
      providesTags: ["BorrowingTransaction"],
    }),
  }),
});

export const {
  //authenticate user
  useLoginMutation,
  useLogoutMutation,
  useCheckUserQuery,

  //employees
  useAddEmployeeMutation,
  useGetEmployeesQuery,
  useDeleteEmployeesMutation,
  useEditEmployeeMutation,
  useGetEmployeeByIdQuery,

  //departments
  useGetDepartmentQuery,

  //item
  useGetItemsQuery,
  useAddItemMutation,
  useEditItemMutation,
  useDeleteItemsMutation,
  useGetItemsByOwnerQuery,

  //item-category
  useGetItemCategoriesQuery,
  useAddCategoryItemMutation,
  useEditCategoryItemMutation,

  //borrowing transaction
  useAddBorrowingTransactionMutation,
  useGetBorrowingTransactionByBorrowerQuery,
} = apiSlice;
