"use client";

import React, { ReactNode, useEffect, useMemo, useTransition } from "react";
import StoreProvider, { useAppSelector } from "@/app/redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { GlobalSnackbarProvider } from "@/context/GlobalSnackbar";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/app/(component)/sidebar";
import Topbar from "@/app/(component)/topbar";
import SocketProvider from "../provider/SocketProvider";
import { usePathname } from "next/navigation";
import Loader from "@/app/(component)/loader";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

//for darkmode
//snackbar
const Wrapper = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  //loading state
  const [loading, startTransition] = useTransition();

  //router
  const pathname = usePathname();

  useEffect(() => {
    startTransition(() => {});
  }, [pathname]); // Run when pathname changes

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <GlobalSnackbarProvider>
          <AuthProvider>
            <div
              className={`flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden ${
                isDarkMode ? "dark" : "light"
              }`}
            >
              <SocketProvider />
              <Sidebar />
              <Topbar />
              {loading && <Loader />}
              <div className="p-4">{children}</div>
            </div>
          </AuthProvider>
        </GlobalSnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Wrapper>{children}</Wrapper>
    </StoreProvider>
  );
};

export default AppWrapper;
