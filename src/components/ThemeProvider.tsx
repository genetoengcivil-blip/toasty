"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getTheme, saveTheme } from "@/lib/user-preferences";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>("dark");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setTheme("dark");
      setLoaded(true);
      return;
    }
    getTheme(user.id).then((t) => {
      setTheme(t);
      setLoaded(true);
    });
  }, [user]);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.setAttribute("data-theme", theme);
    if (user) {
      saveTheme(user.id, theme);
    }
  }, [theme, loaded, user]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}