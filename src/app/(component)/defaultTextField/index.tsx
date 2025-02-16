import { TextField } from "@mui/material";
import React from "react";

const DefaultTextField = ({
  name,
  label,
  onChange,
  placeholder,
  value,
  required = true,
}: {
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  required?: boolean;
}) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth
      required={required}
    />
  );
};

export default DefaultTextField;
