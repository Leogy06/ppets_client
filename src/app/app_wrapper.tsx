"use client";

import React, { ReactNode, useEffect, useMemo } from "react";
import Topbar from "./(component)/topbar";
import Sidebar from "./(component)/sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { GlobalSnackbarProvider } from "@/context/GlobalSnackbar";
import { usePathname } from "next/navigation";

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

  const pathname = usePathname();

  const mustLogin = pathname === "/";

  return (
    <ThemeProvider theme={muiTheme}>
      <GlobalSnackbarProvider>
        <div
          className={`flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden ${
            isDarkMode ? "dark" : "light"
          }`}
        >
          {!mustLogin && <Topbar />}
          <Sidebar />
          {children}
        </div>
      </GlobalSnackbarProvider>
    </ThemeProvider>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Wrapper>
        <div className="p-4 overflow-auto relative ">{children}</div>
      </Wrapper>
    </StoreProvider>
  );
};

export default AppWrapper;
