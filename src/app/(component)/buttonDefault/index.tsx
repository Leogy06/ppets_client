import { Button } from "@mui/material";
import React from "react";

interface DefaultButtonProps {
  btnText: string;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  color?: "primary" | "success" | "secondary";
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  btnText,
  variant = "contained",
  onClick,
  type = "button",
  disabled = false,
  color = "primary",
}) => {
  return (
    <Button
      color={color}
      variant={variant}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {btnText}
    </Button>
  );
};

export default DefaultButton;
