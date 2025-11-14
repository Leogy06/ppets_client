"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-primary bg-gradient-to-br from-primary to-purple-900 text-white">
      <motion.div
        className="container mx-auto py-10 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="space-y-1">
          <h3 className="text-xl font-bold">City Accountant&apos;s Office</h3>
          <h4 className="text-base font-medium opacity-90">
            Property Plant &amp; Equipment Tracking System
          </h4>
        </div>

        <div className="mt-6 border-t border-white/20 pt-4">
          <p className="text-sm opacity-80 leading-tight">
            Developed by HTC-GSC Interns <br /> &copy; 2025
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
