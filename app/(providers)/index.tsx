"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { store } from "@/lib/store";
import React from "react";
import { Provider } from "react-redux";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
};

export default AllProviders;
