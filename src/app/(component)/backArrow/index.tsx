import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React from "react";

const BackArrow = ({ backTo }: { backTo: string }) => {
  const router = useRouter();
  return (
    <button
      className="p-4 hover:bg-gray-200 rounded-full"
      onClick={() => router.push(backTo)}
    >
      <ArrowBack />
    </button>
  );
};

export default BackArrow;
