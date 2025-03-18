import { Theme } from "@emotion/react";
import { Button, SxProps, Tooltip } from "@mui/material";
import React from "react";

interface DefaultButtonProps {
  btnText?: string;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  color?: "primary" | "success" | "secondary" | "error" | "warning" | "info";
  title?: string;
  placement?: "left" | "top" | "right" | "bottom";
  btnIcon?: React.ReactNode;
  secondIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
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
  sx = {},
}) => {
  const button = (
    <span>
      <Button
        color={color}
        variant={variant}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className="flex items-center gap-1"
        sx={sx}
      >
        {btnIcon}
        {secondIcon}
        {btnText}
      </Button>
    </span>
  );
  return title ? (
    <Tooltip
      title={<div className="text-base">{title && title}</div>}
      placement={placement}
    >
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default DefaultButton;
