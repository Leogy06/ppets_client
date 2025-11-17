import React from "react";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8">{children}</main>
  );
};

export default UsersLayout;
