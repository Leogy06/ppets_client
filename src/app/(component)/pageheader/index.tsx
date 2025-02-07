import React from "react";

interface PageHeaderProps {
  pageHead: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageHead }) => {
  return <h1 className="font-bold text-lg mb-4">{pageHead}</h1>;
};

export default PageHeader;
