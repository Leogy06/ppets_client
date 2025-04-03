"use client";

import PageHeader from "@/app/(component)/pageheader";
import { ArrowBack, NotificationsActiveOutlined } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  useGetNotificationCountQuery,
  useGetNotificationQuery,
} from "../../features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { skipToken } from "@reduxjs/toolkit/query";
import useSocket from "@/hooks/useSocket";
import OptionRowLimitCount from "../(component)/optionRowLimit";
import { NotificationProps } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";

const Notifications = () => {
  const router = useRouter();
  //use details
  const { user } = useAuth();
  //notification limit
  const [notificationLimit, setNotificationLimit] = useState(10);
  const {
    data: notifications,
    isLoading: isNotificationLoading,
    refetch: refetchNotifications,
  } = useGetNotificationQuery(
    user?.emp_id
      ? { limit: notificationLimit, empId: Number(user.emp_id) }
      : skipToken
  );
  //get notificaiton count
  const { data: notificationCount, isLoading: isNotificationCountLoading } =
    useGetNotificationCountQuery(Number(user?.emp_id));

  //notification row
  const NotificationRow = (props: NotificationProps) => (
    <div className="border-b px-4 py-2">{dateFormmater(props.createdAt)}</div>
  );

  //initialized socket connection
  useSocket(Number(user?.emp_id), () => refetchNotifications());

  if (isNotificationLoading) {
    return <div className="flex text-center animate-pulse">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center gap-1 mb-4">
          <button onClick={() => router.back()}>
            <ArrowBack />
          </button>
          <PageHeader
            pageHead="Notifications"
            icon={NotificationsActiveOutlined}
            hasMarginBottom={false}
          />
          {!isNotificationCountLoading && (
            <OptionRowLimitCount
              onChange={(limit) => setNotificationLimit(limit)}
              className="bg-white"
              currentValue={notificationLimit}
              totalCount={notificationCount}
            />
          )}
        </div>

        <Paper>
          {notifications?.map((notification, index) => (
            <NotificationRow key={notification.ID} {...notification} />
          ))}
        </Paper>
      </div>
    </>
  );
};

export default Notifications;
