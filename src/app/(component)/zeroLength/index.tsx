import React from "react";

interface Props {
  message: string;
}

const ZeroLength = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <p>{message}</p>
    </div>
  );
};

export default ZeroLength;
