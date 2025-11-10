"use client";

import { useLoading } from "@/app/(context)/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = () => {
  const { isPending } = useLoading();

  return (
    <AnimatePresence>
      {isPending && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-white font-medium text-lg">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
