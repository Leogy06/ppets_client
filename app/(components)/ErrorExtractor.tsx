import React from "react";

const ErrorExtractor = ({
  mainMsg,
  arrayMsg,
}: {
  mainMsg: { data: { message: string } };
  arrayMsg: { message: string }[];
}) => {
  return (
    <div className="flex flex-col">
      <h3>{mainMsg.data.message ?? "Unknown Error"}</h3>
      {arrayMsg
        ? arrayMsg.map((err) => <div key={err.message}>{err.message}</div>)
        : "Unknown error(s)"}
    </div>
  );
};

export default ErrorExtractor;
