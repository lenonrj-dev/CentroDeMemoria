"use client";

import { createContext, useContext, useMemo, useState } from "react";

const defaultPreferences = {
  tableDensity: "comfortable",
  secondaryColor: "cyan",
  showAvatars: true,
  showTags: true,
  alerts: {
    critical: true,
    warnings: true,
    refreshInterval: 30,
  },
};

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaultPreferences);

  const updatePreferences = (changes) => {
    setPreferences((prev) => ({
      ...prev,
      ...changes,
      alerts: { ...prev.alerts, ...changes.alerts },
    }));
  };

  const value = useMemo(() => ({ preferences, updatePreferences, defaults: defaultPreferences }), [preferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences deve ser usado dentro de PreferencesProvider");
  return ctx;
}
