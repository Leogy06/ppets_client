import React from "react";
import PageHeader from "../(component)/pageheader";
import { Notifications } from "@mui/icons-material";

const NotificationList = () => {
  return (
    <div className="flex flex-col">
      <PageHeader icon={Notifications} pageHead="Notification List" />
    </div>
  );
};

export default NotificationList;
