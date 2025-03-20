import {
  TransactionProps,
  Department,
  Employee,
  DistributedItemProps,
  StatusProcess,
  UndistributedItem,
} from "@/types/global_types";
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
    "Transactions",
    "StatusProcess",
    "Notifications",
    "UndistributedItem",
    "TransactionCount",
    "AccountCodes",
  ],
  endpoints: (builder) => ({
    //users
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
    firstTimeLogin: builder.mutation({
      query: (ID_NUMBER) => ({
        url: "/user/auth/api/first_time_login",
        method: "POST",
        body: { ID_NUMBER },
      }),
      invalidatesTags: ["User"],
    }),
    //add user role 2
    addUser: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: data,
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
      query: ({ data }) => ({
        url: `/employees`,
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
    getEmployeeById: builder.query<Employee, number>({
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
    getItems: builder.query<DistributedItemProps[], void>({
      query: () => "/item",
      providesTags: ["Items"],
    }),

    //get items by id
    getItemsById: builder.query<DistributedItemProps, number>({
      query: (itemId: number) => `/item/byId/${itemId}`,
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
    //get items by department
    getItemsDepartment: builder.query<DistributedItemProps[], number>({
      query: (department) => `/item/byDepartment/${department}`,
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

    getItemsNotOwned: builder.query<
      DistributedItemProps[],
      { empId: number; departmentId: number }
    >({
      query: ({ empId, departmentId }) =>
        `/item/notOwned/${empId}?departmentId=${departmentId}`,
      providesTags: ["Items"],
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
    //status
    getStatusProcess: builder.query<StatusProcess[], void>({
      query: () => "/status_process",
      providesTags: ["StatusProcess"],
    }),

    //notifications
    //get notification
    getNotification: builder.query({
      query: ({ empId, limit }) =>
        `/notification?empId=${empId}&limit=${limit}`,
      providesTags: ["Notifications"],
    }),
    //add notificaitonks
    addNotification: builder.mutation({
      query: (data) => ({
        url: "/notification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
    //edit notification
    editNotification: builder.mutation({
      query: ({ notifId, editEntries }) => ({
        url: `/notification?notifId=${notifId}`,
        method: "PUT",
        body: editEntries,
      }),
      invalidatesTags: ["Notifications"],
    }),

    //the undistributed items item
    createUndistributedItem: builder.mutation({
      query: (data) => ({
        url: "/api/item",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UndistributedItem"],
    }),
    getUnDistributeItem: builder.query<UndistributedItem[], number>({
      query: (deptID) => `/api/item?DEPARTMENT_ID=${deptID}`,
      providesTags: ["UndistributedItem"],
    }),
    deleteUndistributedItem: builder.mutation({
      query: (itemIds) => ({
        url: `/api/item/delete`,
        method: "DELETE",
        body: { ids: itemIds },
      }),
      invalidatesTags: ["UndistributedItem"],
    }),
    restoreUndistributedItem: builder.mutation({
      query: (itemIds) => ({
        url: `/api/item/restore`,
        method: "PUT",
        body: { ids: itemIds },
      }),
      invalidatesTags: ["UndistributedItem"],
    }),
    getUndistributedItemById: builder.query<UndistributedItem, number>({
      query: (itemId) => `/api/item/${itemId}`,
      providesTags: ["UndistributedItem"],
    }),

    //get account item
    getAccountItem: builder.query({
      query: () => "/account_code",
      providesTags: ["AccountCodes"],
    }),

    //transactions
    //get transactions
    getTransactions: builder.query<
      TransactionProps[],
      { DPT_ID: number; TRANSACTION_TYPE: number }
    >({
      query: ({ DPT_ID, TRANSACTION_TYPE }) =>
        `/transaction?DPT_ID=${DPT_ID}&TRANSACTION_TYPE=${TRANSACTION_TYPE}`,
      providesTags: ["Transactions"],
    }),
    // borrow transactions
    createBorrowingTransaction: builder.mutation({
      query: (data) => ({
        url: "/transaction/borrow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  //authenticate user
  useLoginMutation,
  useLogoutMutation,
  useCheckUserQuery,
  useFirstTimeLoginMutation,
  useAddUserMutation,

  //employees
  useAddEmployeeMutation,
  useGetEmployeesQuery,
  useDeleteEmployeesMutation,
  useEditEmployeeMutation,
  useGetEmployeeByIdQuery,

  //departments
  useGetDepartmentQuery,

  //item(distrubuted)
  useGetItemsQuery,
  useAddItemMutation,
  useEditItemMutation,
  useDeleteItemsMutation,
  useGetItemsByOwnerQuery,
  useGetItemsDepartmentQuery,
  useGetItemsByIdQuery,
  useGetItemsNotOwnedQuery,

  //item-category
  useGetItemCategoriesQuery,
  useAddCategoryItemMutation,
  useEditCategoryItemMutation,

  //status process
  useGetStatusProcessQuery,

  //notification
  useGetNotificationQuery,
  useEditNotificationMutation,

  //item(not distrbuted)
  useCreateUndistributedItemMutation,
  useGetUnDistributeItemQuery,
  useDeleteUndistributedItemMutation,
  useGetUndistributedItemByIdQuery,
  useRestoreUndistributedItemMutation,

  //account items
  useGetAccountItemQuery,

  //transactions
  useGetTransactionsQuery,
  //borrow
  useCreateBorrowingTransactionMutation,
} = apiSlice;
