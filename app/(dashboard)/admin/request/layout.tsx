import React from "react";

const RequestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6 lg:px-8 space-y-4">
      {children}
    </main>
  );
};

export default RequestLayout;
