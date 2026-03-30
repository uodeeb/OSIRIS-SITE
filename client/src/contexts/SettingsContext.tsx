import React, { createContext, useContext, useMemo, useState } from "react";

export interface ExperienceSettings {
  cinematicEnabled: boolean;
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  masterVolume: number;
}

interface SettingsContextValue {
  settings: ExperienceSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExperienceSettings>>;
}

const defaultSettings: ExperienceSettings = {
  cinematicEnabled: true,
  musicEnabled: true,
  soundEffectsEnabled: true,
  masterVolume: 0.8,
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  setSettings: () => undefined,
});

interface SettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: Partial<ExperienceSettings>;
}

export function SettingsProvider({ children, initialSettings }: SettingsProviderProps) {
  const [settings, setSettings] = useState<ExperienceSettings>({
    ...defaultSettings,
    ...initialSettings,
  });

  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
