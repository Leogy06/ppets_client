"use client";

import PageHeader from "@/app/(component)/pageheader";
import { ArrowBack, NotificationsActiveOutlined } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useGetNotificationQuery } from "../../features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { skipToken } from "@reduxjs/toolkit/query";
import useSocket from "@/hooks/useSocket";

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

  //notification row
  const NotificationRow = ({ index }: { index: number }) => (
    <div className="border-b px-4 py-2">{index}</div>
  );

  //initialized socket connection
  useSocket(Number(user?.emp_id), () => refetchNotifications());

  if (isNotificationLoading) {
    return <div className="flex text-center animate-pulse">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col mb-4">
        <div className="flex items-center gap-1">
          <button onClick={() => router.back()}>
            <ArrowBack />
          </button>
          <PageHeader
            pageHead="Notifications"
            icon={NotificationsActiveOutlined}
            hasMarginBottom={false}
          />
        </div>

        <Paper>
          {notifications?.map((notification, index) => (
            <NotificationRow key={notification.ID} index={index} />
          ))}
        </Paper>
      </div>
    </>
  );
};

export default Notifications;
