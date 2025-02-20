import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

const BackArrow = ({ backTo }: { backTo: string }) => {
  const router = useRouter();
  return (
    <button
      className="hover:text-gray-500 "
      onClick={() => router.push(backTo)}
    >
      <ArrowBack />
    </button>
  );
};

export default BackArrow;
