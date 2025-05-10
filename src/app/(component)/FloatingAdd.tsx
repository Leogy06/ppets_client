import { Add } from "@mui/icons-material";
import { Fab, Tooltip } from "@mui/material";
import React from "react";

interface FloatingAddProps {
  toolTipTitle: string;
  onClick: () => void;
}

const FloatingAdd = ({ toolTipTitle, onClick }: FloatingAddProps) => {
  return (
    <Tooltip
      placement="left"
      title={<span className="text-base">{toolTipTitle}</span>}
      sx={{ position: "absolute", bottom: "1rem", right: "1rem" }}
    >
      <Fab color="primary" aria-label="add" onClick={onClick}>
        <Add />
      </Fab>
    </Tooltip>
  );
};

export default FloatingAdd;
