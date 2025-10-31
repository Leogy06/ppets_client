"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/lib/store";
import React from "react";
import { Provider } from "react-redux";
import Footer from "../(components)/footer";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors duration={6000} />
      </ThemeProvider>
    </Provider>
  );
};

export default AllProviders;
