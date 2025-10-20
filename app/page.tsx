import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Button>Click</Button>
      <Image src="/logo.png" width={62} height={32} alt="logo" />
    </div>
  );
};

export default HomePage;
