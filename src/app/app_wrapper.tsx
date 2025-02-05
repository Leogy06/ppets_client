"use client";

import React, { ReactNode, useEffect, useMemo } from "react";
import Topbar from "./(component)/topbar";
import Sidebar from "./(component)/sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { createTheme, ThemeProvider } from "@mui/material";

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
      <div
        className={`flex flex-col h-screen bg-gray-50 text-gray-900 ${
          isDarkMode ? "dark" : "light"
        }`}
      >
        <Topbar />
        <Sidebar />
        {children}
      </div>
    </ThemeProvider>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Wrapper>
        <div className="p-4">{children}</div>
      </Wrapper>
    </StoreProvider>
  );
};

export default AppWrapper;
