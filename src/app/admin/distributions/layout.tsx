import PageHeader from "@/app/(component)/pageheader";
import { AccountTreeOutlined } from "@mui/icons-material";
import React from "react";

const DistributionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageHeader pageHead="Distribution" icon={AccountTreeOutlined} />
      {children}
    </>
  );
};

export default DistributionLayout;
