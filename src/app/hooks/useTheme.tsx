import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Use centralized theme tokens
import { THEMES, ThemeName, ThemeTokens, FontTokens } from "../constants/theme";

const STORAGE_KEY = "app.themeName";

// ---------- Context ----------
export type ThemeCtxValue = {
  themeName: ThemeName;
  theme: { colors: ThemeTokens; fonts: FontTokens };
  setThemeName: (n: ThemeName) => void;

  // helpers (renamed)
  token: (path: string) => string;
  fontFamily: (key: keyof FontTokens) => string;
};

const ThemeCtx = createContext<ThemeCtxValue | null>(null);

// ---------- Provider ----------
export const ThemeProvider: React.FC<{
  initial?: ThemeName;
  children: React.ReactNode;
}> = ({ initial = "light", children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (saved && THEMES[saved]) return saved;
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : initial;
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, themeName);
    }
  }, [themeName]);

  const theme = useMemo(() => THEMES[themeName], [themeName]);

  // Simple helpers (memoized by theme)
  const token = useMemo(
    () =>
      (path: string): string => {
        const parts = path.split(".");
        // @ts-ignore simple nested lookup over colors
        return parts.reduce((acc, k) => (acc ? acc[k] : undefined), theme.colors) ?? "";
      },
    [theme.colors]
  );

  const fontFamily = useMemo(
    () =>
      (key: keyof FontTokens): string => {
        return theme.fonts[key];
      },
    [theme.fonts]
  );

  const value = useMemo(
    () =>
      ({
        themeName,
        theme,
        setThemeName,
        token,
        fontFamily,
      }) satisfies ThemeCtxValue,
    [themeName, theme, token, fontFamily]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

// ---------- Hook ----------
export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
