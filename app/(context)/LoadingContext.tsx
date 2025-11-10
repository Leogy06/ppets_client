"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouterTransition } from "../(hooks)/routerTransition";

// 1. Define the type
interface LoadingContextProps {
  isPending: boolean;
  push: (path: string) => void;
  back: () => void;
  replace: (path: string) => void;
}

// 2. Create context with default values
const LoadingContext = createContext<LoadingContextProps>({
  isPending: false,
  push: () => {},
  back: () => {},
  replace: () => {},
});

// 3. Provider
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const { push, isPending, back, replace } = useRouterTransition();

  return (
    <LoadingContext.Provider
      value={{
        isPending,
        push,
        back,
        replace,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// 4. Custom hook
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
