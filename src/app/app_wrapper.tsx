"use client";

import React, { ReactNode, useEffect, useMemo } from "react";
import StoreProvider, { useAppSelector } from "./redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { GlobalSnackbarProvider } from "@/context/GlobalSnackbar";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "./(component)/sidebar";

//for darkmode
//snackbar
const Wrapper = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <GlobalSnackbarProvider>
        <div
          className={`flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden ${
            isDarkMode ? "dark" : "light"
          }`}
        >
          {children}
        </div>
      </GlobalSnackbarProvider>
    </ThemeProvider>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <Sidebar />
        <Wrapper>{children}</Wrapper>
      </AuthProvider>
    </StoreProvider>
  );
};

export default AppWrapper;
