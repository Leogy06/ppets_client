import { Paper } from "@mui/material";
import React from "react";

const DistributionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Paper>{children}</Paper>
    </>
  );
};

export default DistributionLayout;
