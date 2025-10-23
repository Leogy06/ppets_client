"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/lib/store";
import React from "react";
import { Provider } from "react-redux";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <main>{children}</main>
        <Toaster position="top-center" richColors duration={6000} />
      </ThemeProvider>
    </Provider>
  );
};

export default AllProviders;
