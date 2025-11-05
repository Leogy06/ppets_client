"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { store, persistor } from "@/lib/store";
import React from "react";
import { Provider } from "react-redux";
import Footer from "../(components)/footer";
import { PersistGate } from "redux-persist/integration/react";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          <main>{children}</main>
          <Footer />
          <Toaster position="top-center" richColors duration={6000} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default AllProviders;
