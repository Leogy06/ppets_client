"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const EmployeeHeader = dynamic(
  () => import("@/app/(components)/employee-header")
);

const EmployeeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-4">
      <EmployeeHeader />
      <motion.main
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        className="container mx-auto py-10 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default EmployeeLayout;
