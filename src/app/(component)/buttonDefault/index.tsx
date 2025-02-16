import { Button, Tooltip } from "@mui/material";
import React from "react";

interface DefaultButtonProps {
  btnText?: string;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  color?: "primary" | "success" | "secondary";
  title?: string;
  placement?: "left" | "top" | "right";
  btnIcon?: React.ReactNode;
  secondIcon?: React.ReactNode;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  btnText,
  variant = "contained",
  onClick,
  type = "button",
  disabled = false,
  color = "primary",
  title,
  btnIcon,
  placement = "left",
  secondIcon,
}) => {
  return (
    <Tooltip title={title} placement={placement}>
      <Button
        color={color}
        variant={variant}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className="flex items-center gap-1"
      >
        {btnIcon}
        {secondIcon}
        {btnText}
      </Button>
    </Tooltip>
  );
};

export default DefaultButton;
