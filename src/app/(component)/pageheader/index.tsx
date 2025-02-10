"use client";

import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  pageHead: string;
  icon?: SvgIconComponent;
  onClick?: () => void;
  pathTo?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  pageHead,
  icon,
  onClick,
  pathTo,
}) => {
  const pathname = usePathname();
  return (
    <h1
      className={`font-bold text-lg mb-4 flex gap-1 cursor-pointer hover:bg-gray-200 p-2 rounded ${
        pathTo === pathname ? "hidden" : "flex"
      } `}
      onClick={onClick}
    >
      {icon && React.createElement(icon)}
      {pageHead}
    </h1>
  );
};

export default PageHeader;
