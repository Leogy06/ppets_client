"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button onClick={() => router.push("/login")}>
        <ArrowRight />
        Go to login Page
      </Button>
    </div>
  );
};

export default HomePage;
