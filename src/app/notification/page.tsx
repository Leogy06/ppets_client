"use client";

import PageHeader from "@/app/(component)/pageheader";
import { ArrowBack, NotificationsActiveOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetNotificationQuery } from "../../features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { Paper } from "@mui/material";

const Notifications = () => {
  const router = useRouter();
  //use details
  const { empDetails } = useAuth();
  //notification limit
  const [notificationLimit, setNotificationLimit] = useState(10);
  const { data: notifications, isLoading: isNotificationLoading } =
    useGetNotificationQuery({
      limit: notificationLimit,
      empId: Number(empDetails?.ID),
    });

  useEffect(() => {
    if (empDetails?.ID) {
      console.log("emp detail ", empDetails);
    }
  }, [empDetails?.ID]);

  //notification row
  const NotificationRow = () => (
    <div className="border-b px-4 py-2">Notification</div>
  );
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <button onClick={() => router.back()}>
          <ArrowBack />
        </button>
        <PageHeader
          pageHead="Notifications"
          icon={NotificationsActiveOutlined}
          hasMarginBottom={false}
        />

        <Paper>
          {notifications?.map((notification) => (
            <NotificationRow key={notification.ID} />
          ))}
        </Paper>
      </div>
    </>
  );
};

export default Notifications;
