"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
      <Button onClick={() => router.push("/login")}>Click</Button>
    </div>
  );
};

export default HomePage;
