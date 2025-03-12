import React from "react";
import PageHeader from "../(component)/pageheader";
import { Dashboard } from "@mui/icons-material";

const AdminDashboard = () => {
  return (
    <>
      <PageHeader icon={Dashboard} pageHead="Dashboard" />
      <div>
        <p>Total Request: </p>
        <p>Today's Request</p>
      </div>
    </>
  );
};

export default AdminDashboard;
