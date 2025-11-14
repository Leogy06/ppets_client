"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, BadgeCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary/80 bg-gradient-to-br from-primary/80 to-purple-900/80 backdrop-blur-xl border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto py-10 px-4 text-center"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 animate-[shimmer_2.2s_infinite]"></div>
        </div>

        <div className="flex flex-col items-center space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-white/90" />
            <h3 className="text-xl font-bold text-white">
              City Accountant&apos;s Office
            </h3>
          </div>

          <div className="flex items-center gap-2 opacity-90">
            <BadgeCheck className="w-4 h-4 text-white/80" />
            <h4 className="text-base font-medium text-white">
              Property Plant &amp; Equipment Tracking System
            </h4>
          </div>
        </div>

        <div className="mt-6 border-t border-white/20 pt-4 relative z-10">
          <p className="text-sm opacity-80 leading-tight text-white">
            Developed by HTC-GSC Interns <br /> &copy; 2025
          </p>
        </div>
      </motion.div>

      {/* Shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
