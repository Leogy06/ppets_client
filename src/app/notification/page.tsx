"use client";

import PageHeader from "@/app/(component)/pageheader";
import {
  ArrowBack,
  NotificationsActiveOutlined,
  Refresh,
} from "@mui/icons-material";
import { Paper, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  useGetNotificationCountQuery,
  useGetNotificationQuery,
  useGetUnreadNotificationCountQuery,
  useMarkReadNotificationMutation,
} from "../../features/api/apiSlice";
import { useAuth } from "@/context/AuthContext";
import { skipToken } from "@reduxjs/toolkit/query";
import useSocket from "@/hooks/useSocket";
import OptionRowLimitCount from "../(component)/optionRowLimit";
import { NotificationProps } from "@/types/global_types";
import { dateFormmater } from "@/utils/date_formmater";
import { transactionStatus, transactionType } from "@/utils/transactions";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";
import ZeroLength from "@/app/(component)/zeroLength";

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
  //refetch notification count
  const { refetch: refetchNotificationCount } =
    useGetUnreadNotificationCountQuery(Number(user?.emp_id));

  //mark all notification as read
  const [markReadNotification] = useMarkReadNotificationMutation();

  //notification row
  const NotificationRow = (props: NotificationProps) => {
    return (
      <Paper
        className="flex flex-col bg-white shadow-sm hover:shadow-md border border-gray-200 rounded-lg p-4 mb-4"
        elevation={3}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg">
            {transactionType(props.TRANSACTION)}
          </h1>
          <span className="text-gray-500">
            {dateFormmater(props.createdAt)}
          </span>
        </div>
        <div className="flex items-start gap-4 my-2">
          <div className="flex flex-col max-w-[40%] gap-2">
            <div className="flex flex-col">
              <span className="font-semibold">Status:</span>
              <span>{transactionStatus(props.REQUEST_STATUS)}</span>
            </div>
            <span className="font-semibold">Owner:</span>
            <span>{fullNamer(props.ownerEmpDetails)}</span>
            <span className="font-semibold">Borrower:</span>
            <span>{fullNamer(props.borrowerEmpDetails)}</span>
          </div>
          <div className="flex flex-col max-w-[33%]">
            <span className="font-semibold">Item:</span>
            <span>{getItemName(props.itemDetails)}</span>
            <span className="font-semibold">Quantity:</span>
            <span>{props.QUANTITY}</span>
          </div>
        </div>
      </Paper>
    );
  };

  //mark notification as read
  const handleMarkNotificationRead = async () => {
    try {
      const notificationIds =
        notifications?.map(
          (notification: NotificationProps) => notification.ID
        ) || [];
      await markReadNotification(notificationIds);
      refetchNotificationCount();
    } catch (error) {
      console.error("Unable to mark read notifications", error);
    }
  };

  //initialized socket connection
  useSocket(Number(user?.emp_id), () => refetchNotifications());

  if (isNotificationLoading) {
    return <div className="flex text-center animate-pulse">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
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
          <Tooltip
            title={<span className="text-base">Refresh Notifications</span>}
            placement="left"
          >
            <button onClick={refetchNotifications}>
              <Refresh />
            </button>
          </Tooltip>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          {notifications?.length === 0 ? (
            <ZeroLength message="No Notifications" />
          ) : (
            notifications?.map((notification) => (
              <NotificationRow key={notification.ID} {...notification} />
            ))
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="hover:underline underline-offset-1"
            onClick={handleMarkNotificationRead}
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </>
  );
};

export default Notifications;
