"use client";

import PageHeader from "@/app/(component)/pageheader";
import {
  ArrowBack,
  NotificationsActiveOutlined,
  Refresh,
} from "@mui/icons-material";
import { Paper, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { transactionStatus, transactionType } from "@/utils/transactions";
import fullNamer from "@/utils/fullNamer";
import getItemName from "@/utils/getItemName";

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
    <div
      className={`flex items-center hover:bg-gray-500 gap-4 cursor-pointer justify-between border-b border-gray-300 px-4 py-2  ${
        props.READ === 0 && "bg-gray-200"
      }`}
    >
      <div className="flex flex-col max-w-[40%] gap-2">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">
            {transactionType(props.TRANSACTION)}
          </h1>
          <span>Status: {transactionStatus(props.REQUEST_STATUS)}</span>
        </div>{" "}
        <span>Owner: {fullNamer(props.ownerEmpDetails)}</span>
        <span>Borrower: {fullNamer(props.borrowerEmpDetails)}</span>
      </div>
      <span className="max-w-[33%] text-start">
        Item: {getItemName(props.itemDetails)}
      </span>
      <span className="w-auto">{dateFormmater(props.createdAt)}</span>
    </div>
  );

  useEffect(() => {
    if (notifications) {
      console.log("notifications ", notifications);
    }
  }, [notifications]);

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
          <Tooltip title="Refresh Notifications">
            <button onClick={refetchNotifications}>
              <Refresh />
            </button>
          </Tooltip>
        </div>

        <Paper sx={{ maxHeight: "70vh", overflow: "auto" }}>
          {notifications?.map((notification, index) => (
            <NotificationRow key={notification.ID} {...notification} />
          ))}
        </Paper>
      </div>
    </>
  );
};

export default Notifications;
