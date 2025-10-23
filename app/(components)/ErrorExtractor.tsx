import React from "react";

const ErrorExtractor = ({
  mainMsg,
  arrayMsg,
}: {
  mainMsg: string;
  arrayMsg: { message: string }[];
}) => {
  return (
    <div className="flex flex-col">
      <h3>{mainMsg}</h3>
      {arrayMsg.map((err) => (
        <div key={err.message}>{err.message}</div>
      ))}
    </div>
  );
};

export default ErrorExtractor;
