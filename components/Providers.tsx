"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { ToastContainer } from "react-toastify";

type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

const ThemeContext = createContext<{
  theme: Theme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  toggleTheme: () => void;
}>({ theme: "light", preference: "system", setPreference: () => {}, toggleTheme: () => {} });

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getPreference(): ThemePreference {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

function apply(preference: ThemePreference) {
  const dark = preference === "dark" || (preference === "system" && darkQuery().matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  const preference = useSyncExternalStore(subscribe, getPreference, () => "system" as ThemePreference);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {}
    apply(next);
    notify();
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(getTheme() === "dark" ? "light" : "dark");
  }, [setPreference]);

  // Follow the OS setting while the preference is "system".
  useEffect(() => {
    const mq = darkQuery();
    const onChange = () => {
      if (getPreference() === "system") {
        apply("system");
        notify();
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        newestOnTop
        pauseOnHover
        hideProgressBar
        closeOnClick
        theme={theme}
      />
    </ThemeContext.Provider>
  );
}
