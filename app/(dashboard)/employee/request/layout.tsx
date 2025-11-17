"use client";

import React from "react";
import { motion } from "framer-motion";

const RequestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
    >
      {children}
    </motion.main>
  );
};

export default RequestLayout;
