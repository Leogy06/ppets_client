import { Modal } from "@mui/material";
import React from "react";

const DefaultModal = ({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        className={` ${className} dead-center p-8 flex justify-center rounded-lg border max-h-[38rem] w-full md:w-[38rem] overflow-auto`}
      >
        {children}
      </div>
    </Modal>
  );
};

export default DefaultModal;
