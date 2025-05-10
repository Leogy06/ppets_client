import { Modal, Paper } from "@mui/material";
import React from "react";

const DefaultModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          border: "1px solid gray",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "70%", md: "50%", lg: "40%" },
          p: 2,
          maxHeight: "80vh",
        }}
      >
        <div className="flex flex-col gap-4">{children}</div>
      </Paper>
    </Modal>
  );
};

export default DefaultModal;
