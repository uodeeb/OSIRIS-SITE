import React, { createContext, useContext, useMemo, useState } from "react";

interface RTLContextValue {
  isRTL: boolean;
  direction: "rtl" | "ltr";
  setIsRTL: (value: boolean) => void;
}

const defaultValue: RTLContextValue = {
  isRTL: true,
  direction: "rtl",
  setIsRTL: () => undefined,
};

const RTLContext = createContext<RTLContextValue>(defaultValue);

interface RTLProviderProps {
  children: React.ReactNode;
  defaultRTL?: boolean;
}

export function RTLProvider({ children, defaultRTL = true }: RTLProviderProps) {
  const [isRTL, setIsRTL] = useState(defaultRTL);

  const value = useMemo<RTLContextValue>(
    () => ({
      isRTL,
      direction: isRTL ? "rtl" : "ltr",
      setIsRTL,
    }),
    [isRTL],
  );

  return <RTLContext.Provider value={value}>{children}</RTLContext.Provider>;
}

export function useRTL() {
  return useContext(RTLContext);
}
