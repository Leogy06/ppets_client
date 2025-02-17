"use client";

import React from "react";
import { SvgIconComponent } from "@mui/icons-material";

interface PageHeaderProps {
  pageHead: string;
  icon?: SvgIconComponent;
  onClick?: () => void;
  pathTo?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageHead, icon }) => {
  return (
    <h1 className={`font-bold text-lg mb-4 flex gap-1 rounded `}>
      {icon && React.createElement(icon)}
      {pageHead}
    </h1>
  );
};

export default PageHeader;
