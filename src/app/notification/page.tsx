"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "@/app/(component)/pageheader";
import { Notifications } from "@mui/icons-material";
import { useGetNotificationQuery } from "@/features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { NotificationProps } from "@/types/global_types";

const NotificationList = () => {
  const { empDetails } = useAuth();

  const [notificationLimit, setNotificationLimit] = useState<number>(10);
  const {
    data: notifications,
    isLoading: isGetNotifLoading,
    refetch: refetchNotifications,
  } = useGetNotificationQuery({
    empId: empDetails?.ID,
    limit: notificationLimit,
  });

  console.log("notifcations ", notifications);
  console.log("emp details ", empDetails);

  //mapped notification
  const mappedNotifications = useMemo(() => {
    return notifications.map((notification: NotificationProps) => ({
      ...notification,
      borrowingTransactionDetails:
        notification.borrowingTransactionDetails.status,
    }));
  }, [notifications]);

  if (isGetNotifLoading) {
    return <span className="animate-pulse"> Loading...</span>;
  }

  return (
    <div className="flex flex-col">
      <PageHeader icon={Notifications} pageHead="Notification List" />
      {mappedNotifications.map((notification: NotificationProps) => (
        <div key={notification.ID}>
          <span>Status: {notification.borrowingTransactionDetails}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
