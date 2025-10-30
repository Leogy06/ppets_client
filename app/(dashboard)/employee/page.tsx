"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const Employee = () => {
  const router = useRouter();
  return (
    <div>
      <Button onClick={() => router.push("/employee/request")}>Request</Button>
    </div>
  );
};

export default Employee;
