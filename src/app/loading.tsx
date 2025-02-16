"use client";
import React, { useEffect, useState } from "react";

const Loading = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <p className="text-lg font-semibold">Loading{dots}</p>
    </div>
  );
};

export default Loading;
