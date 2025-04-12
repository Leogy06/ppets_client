import {
  TransactionProps,
  Department,
  Employee,
  DistributedItemProps,
  UndistributedItem,
  TransactionStatusProps,
  NotificationProps,
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
      { departmentId: number | undefined; limit: number; DELETED?: number }
    >({
      query: ({ departmentId, limit, DELETED }) =>
        `/employees?departmentId=${departmentId}&limit=${limit}&DELETED=${DELETED}`,
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
    getEmployeeCount: builder.query<number, number>({
      query: (departmentId) =>
        `/employees/api/count?CURRENT_DPT_ID=${departmentId}`,
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
    getNotification: builder.query<
      NotificationProps[],
      {
        empId: Employee["ID"];
        limit: number;
      }
    >({
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
    //get notificaiton count
    getNotificationCount: builder.query<number, number>({
      query: (empId) => `/notification/count?empId=${empId}`,
      providesTags: ["Notifications"],
    }),
    //get unread notification count
    getUnreadNotificationCount: builder.query<number, number>({
      query: (empId) => `/notification/unread/count?empId=${empId}`,
      providesTags: ["Notifications"],
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
    getUnDistributeItem: builder.query<
      UndistributedItem[],
      { deptID: number; limit: number }
    >({
      query: ({ deptID, limit }) =>
        `/api/item?DEPARTMENT_ID=${deptID}&limit=${limit}`,
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
    getUndistributedItemCount: builder.query<number, number>({
      query: (departmentId) =>
        `/api/item/api/count?DEPARTMENT_ID=${departmentId}`,
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
        DPT_ID: number | undefined;
        TRANSACTION_TYPE?: number;
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
    //reject transaction
    rejectTransaction: builder.mutation({
      query: (data) => ({
        url: "/transaction/reject",
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["Transactions"],
    }),
    approveTransferTransaction: builder.mutation({
      query: ({ transactionId, APPROVED_BY }) => ({
        url: `/transaction/approve/transfer?APPROVED_BY=${APPROVED_BY}`,
        method: "PUT",
        body: { transactionId },
      }),
      invalidatesTags: ["Transactions"],
    }),
    //approve return transaction
    approveReturnTransaction: builder.mutation({
      query: ({
        transactionId,
        APPROVED_BY,
      }: {
        transactionId: TransactionProps["id"];
        APPROVED_BY: TransactionProps["APPROVED_BY"];
      }) => ({
        url: `/transaction/approve/return?APPROVED_BY=${APPROVED_BY}`,
        method: "PUT",
        body: { transactionId },
      }),
      invalidatesTags: ["Transactions"],
    }),
    //gettransaction count by remarks
    getTransactionCount: builder.query<
      number,
      {
        remarks?: TransactionProps["remarks"];
        DPT_ID: Employee["CURRENT_DPT_ID"];
      }
    >({
      query: ({ remarks, DPT_ID }) =>
        `/transaction/api/count?remarks=${remarks}&DPT_ID=${DPT_ID}`,
      providesTags: ["Transactions"],
    }),
    getTransactionById: builder.query<TransactionProps, TransactionProps["id"]>(
      {
        query: (transactionId) => `/transaction/${transactionId}`,
        providesTags: ["Transactions"],
      }
    ),
    getTransactionCountToday: builder.query<
      number,
      {
        remarks?: TransactionProps["remarks"];
        DPT_ID: Employee["CURRENT_DPT_ID"]; // Use Employee type for CURRENT_DPT_ID
      }
    >({
      query: ({ DPT_ID }) => `/transaction/api/count/today?DPT_ID=${DPT_ID}`,
      providesTags: ["Transactions"],
    }),
    //return tranasction
    returnTransaction: builder.mutation<
      TransactionProps,
      Partial<TransactionProps>
    >({
      query: (data) => ({
        url: "/transaction/return",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transactions"],
    }),
    markReadNotification: builder.mutation({
      query: (notificationIds: number[]) => ({
        url: "/notification/mark_read",
        method: "POST",
        body: { notificationIds },
      }),
      invalidatesTags: ["Notifications"],
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
    //add distributed item
    addDistributedItem: builder.mutation({
      query: (data) => ({
        url: "/item",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Items", "UndistributedItem"],
    }),
    //get distrubuted item count
    getDistributedItemCount: builder.query<number, number>({
      query: (employeeId) => `/item/api/count?employeeId=${employeeId}`,
      providesTags: ["Items"],
    }),
    //get distributed item count by employee id
    getItemsCountByEmpId: builder.query<number, number>({
      query: (employeeId) => `/item/api/count?employeeId=${employeeId}`,
      providesTags: ["Items"],
    }),
    //report builders api
    buildTransaction: builder.query<
      TransactionProps[],
      {
        departmentId: Employee["CURRENT_DPT_ID"];
        startDate?: string | null;
        endDate?: string | null;
      }
    >({
      query: ({ departmentId, startDate, endDate }) =>
        `/api/build-report/transaction?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Transactions"],
    }),
    buildItemReport: builder.query<
      DistributedItemProps[],
      {
        departmentId: Employee["CURRENT_DPT_ID"];
        startDate?: string | null;
        endDate?: string | null;
        employeeId?: Employee["ID"] | null;
      }
    >({
      query: ({ departmentId, startDate, endDate, employeeId }) =>
        `/api/build-report/items?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}&employeeId=${employeeId}`,
      providesTags: ["Items"],
    }),
    getEmployeeOption: builder.query<Employee[], Employee["CURRENT_DPT_ID"]>({
      query: (deparmentId) =>
        `/api/option-fetcher/employee?departmentId=${deparmentId}`,
      providesTags: ["Employees"],
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
  useGetEmployeeCountQuery,

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
  useGetNotificationCountQuery,
  useGetUnreadNotificationCountQuery,
  useMarkReadNotificationMutation,

  //item(not distrbuted)
  useCreateUndistributedItemMutation,
  useGetUnDistributeItemQuery,
  useDeleteUndistributedItemMutation,
  useGetUndistributedItemByIdQuery,
  useRestoreUndistributedItemMutation,
  useGetUndistributedItemCountQuery,

  //account items
  useGetAccountItemQuery,

  //transactions
  //get
  useGetTransactionsQuery,
  //post
  useCreateTransactionMutation,
  //edit
  useEditTransactionMutation,
  //reject
  useRejectTransactionMutation,
  //approve transfer transaction
  useApproveTransferTransactionMutation,
  useGetTransactionCountQuery,
  //use approve return
  useApproveReturnTransactionMutation,
  //use get transaction count today
  useGetTransactionCountTodayQuery,
  //get trnasaction by id
  useGetTransactionByIdQuery,
  //return
  useReturnTransactionMutation,

  //distributed item
  useGetDistributedItemsQuery,
  //distributed item by id
  useGetDistributedItemByIdQuery,
  //add distributed item
  useAddDistributedItemMutation,
  //get distributed item count
  useGetDistributedItemCountQuery,
  //get distributed item count by employee id
  useGetItemsCountByEmpIdQuery,
  //report builders api
  useBuildTransactionQuery,
  //build item report
  useBuildItemReportQuery,
  //get employee option
  useGetEmployeeOptionQuery,
} = apiSlice;
