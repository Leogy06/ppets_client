"use client";

import PageHeader from "@/app/(component)/pageheader";
import { ArrowBack, NotificationsActiveOutlined } from "@mui/icons-material";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const Notifications = () => {
  const router = useRouter();

  //notification row
  const Rows = () => (
    <div className="w-full text-center border-b px-4 py-2">notificaiton</div>
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
      </div>
      <Paper sx={{ maxHeight: "70vh", overflow: "auto" }}>
        <div className="flex flex-col">
          <Rows />
        </div>
      </Paper>
    </>
  );
};

export default Notifications;
