import React from "react";

const RequestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto py-10 px-8 md:px-0 space-y-4">
      {children}
    </main>
  );
};

export default RequestLayout;
