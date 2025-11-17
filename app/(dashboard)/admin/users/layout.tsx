"use client";

import React from "react";
import { motion } from "framer-motion";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="container mx-auto p-2 sm:p-4 md:p-6 lg:p-8"
    >
      {children}
    </motion.main>
  );
};

export default UsersLayout;
