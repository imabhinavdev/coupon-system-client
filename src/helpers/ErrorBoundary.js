"use client";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "@/components/FallBack";
const ErrorBoundaryComp = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryComp;
