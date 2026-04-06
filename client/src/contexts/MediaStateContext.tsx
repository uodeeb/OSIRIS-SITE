import React, { createContext, useContext } from "react";
import { MediaControllerState } from "./MediaControllerContext";

export const MediaStateContext = createContext<MediaControllerState | null>(null);

export function useMediaState() {
  const ctx = useContext(MediaStateContext);
  if (!ctx) throw new Error("useMediaState must be used within MediaStateProvider");
  return ctx;
}
