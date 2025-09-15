"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

interface ProgressBarProviderProps {
  children: React.ReactNode;
}

const ProgressBarProvider = ({ children }: ProgressBarProviderProps) => {
  return (
    <>
      {children}
      <ProgressBar
        height="10px"
        color="#000"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProvider;
