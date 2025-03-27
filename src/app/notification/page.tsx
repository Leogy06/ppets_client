"use client";

import PageHeader from "@/app/(component)/pageheader";
import { ArrowBack, NotificationsActiveOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

const Notifications = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex gap-2 items-center">
        <button onClick={() => router.back()}>
          <ArrowBack />
        </button>
        <PageHeader
          pageHead="Notifications"
          icon={NotificationsActiveOutlined}
          hasMarginBottom={false}
        />
      </div>
    </>
  );
};

export default Notifications;
