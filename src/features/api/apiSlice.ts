import {
  TransactionProps,
  Department,
  Employee,
  DistributedItemProps,
  UndistributedItem,
  TransactionStatusProps,
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
    getEmployees: builder.query<
      Employee[],
      { departmentId: number | undefined; limit: number }
    >({
      query: ({ departmentId, limit }) =>
        `/employees?departmentId=${departmentId}&limit=${limit}`,
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
        url: `/employees`,
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
    getStatusProcess: builder.query<TransactionStatusProps[], void>({
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

    /**
     *
     *Transactions
     */
    //get transactions
    getTransactions: builder.query<
      TransactionProps[],
      {
        DPT_ID: number;
        TRANSACTION_TYPE: number;
        EMP_ID?: number;
        LIMIT: number;
      }
    >({
      query: ({ DPT_ID, TRANSACTION_TYPE, EMP_ID, LIMIT }) =>
        `/transaction?DPT_ID=${DPT_ID}&TRANSACTION_TYPE=${TRANSACTION_TYPE}&EMP_ID=${EMP_ID}&LIMIT=${LIMIT}`,
      providesTags: ["Transactions"],
    }),
    // transactions
    createTransaction: builder.mutation({
      query: (data) => ({
        url: "/transaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),
    //edit transaction
    editTransaction: builder.mutation({
      query: (data) => ({
        url: "/transaction",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),

    /**
     * Distributed Items
     */
    //distributed item
    getDistributedItems: builder.query<
      {
        ownedItems: DistributedItemProps[];
        notOwnedItems: DistributedItemProps[];
      },
      { department: number; limit: number; owner_emp_id: number }
    >({
      query: ({ department, limit, owner_emp_id }) =>
        `/item?department=${department}&limit=${limit}&owner_emp_id=${owner_emp_id}`,
      providesTags: ["Items"],
    }),

    //get distributed item by id
    getDistributedItemById: builder.query<DistributedItemProps, number>({
      query: (itemId) => `/item/${itemId}`,
      providesTags: ["Items"],
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
  //get
  useGetTransactionsQuery,
  //post
  useCreateTransactionMutation,
  //edit
  useEditTransactionMutation,

  //distributed item
  useGetDistributedItemsQuery,

  //distributed item by id
  useGetDistributedItemByIdQuery,
} = apiSlice;
