import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { Notification } from "@/types";

export const notificationApi = createApi({
  reducerPath: "notificatioApi",
  baseQuery,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotification: builder.query<Notification[], number>({
      query: (take) => `/api/notification/${take}`,
      providesTags: ["Notifications"],
    }),
    readNotification: builder.mutation<void, string[]>({
      query: (notificationIds) => ({
        url: "/api/notification/read",
        method: "PUT",
        body: { ids: notificationIds },
      }),
    }),
  }),
});

export const { useGetNotificationQuery, useReadNotificationMutation } =
  notificationApi;
