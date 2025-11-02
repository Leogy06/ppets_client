import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

const ReadStatus = ({ status }: { status: number }) => {
  if (status === 0) {
    return (
      <span className="flex gap-2 items-center ">
        <CircleX size={18} className="text-red-500" />
        Inactive
      </span>
    );
  }

  return (
    <span className="flex gap-2 items-center">
      <CircleCheck size={18} className="text-green-500" />
      Active
    </span>
  );
};

export default ReadStatus;
