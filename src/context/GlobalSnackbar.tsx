import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SnackbarProps {
  open: boolean;
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

interface SnackbarContextType {
  openSnackbar: (msg: string, severity: SnackbarProps["severity"]) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const GlobalSnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  //snackbar
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const [severitySnack, setSeveritySnack] =
    useState<SnackbarProps["severity"]>("info");

  const openSnackbar = (msg: string, severity: SnackbarProps["severity"]) => {
    setMessage(msg);
    setSeveritySnack(severity);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
    setMessage("");
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      {open && (
        <Snackbar open={open} onClose={closeSnackbar} autoHideDuration={6000}>
          <Alert
            sx={{ width: "100%" }}
            severity={severitySnack}
            variant="filled"
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
