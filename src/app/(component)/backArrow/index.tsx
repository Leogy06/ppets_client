import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

const BackArrow = ({ backTo }: { backTo?: string }) => {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  return (
    <button className="hover:text-gray-500 " onClick={handleBack}>
      <ArrowBack />
    </button>
  );
};

export default BackArrow;
