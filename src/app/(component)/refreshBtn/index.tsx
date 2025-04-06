import { Refresh } from "@mui/icons-material";
import React, { useState } from "react";

interface Props {
  onClick: () => void;
}

const RefreshButton = ({ onClick }: Props) => {
  const [spinning, setSpinning] = useState(false);
  const handleClick = () => {
    setSpinning(true);
    onClick();
    setTimeout(() => setSpinning(false), 900);
  };

  return (
    <button
      onClick={handleClick}
      className="transition duration-300 ease-in-out"
    >
      <Refresh className={spinning ? "animate-spin" : ""} />
    </button>
  );
};

export default RefreshButton;
