// ---------- Define tokens first ----------
export type ThemeName = "light" | "dark";

export type ThemeTokens = {
  page: { 
    bg: string, text: string, 
    primaryBtnBg: string, primaryBtnText: string 
  };
  header: {
    bg: string, text: string
  };
  dropdown: {
    bg: string; border: string; text: string; itemHoverBg: string;
  };
  section: { bg: string; border: string; divider: string };
};

export type FontTokens = {
  raleway: string;
  inter: string;
};

// ---------- Define themes ----------
export const THEMES: Record<ThemeName, { colors: ThemeTokens; fonts: FontTokens }> = {
  light: {
    colors: {
      page: { 
        bg: "#DFF5FF", text: "#111827", 
        primaryBtnBg: "#2563eb", primaryBtnText: "#ffffff" 
      },
      header: { bg: "#378CE7", text: "#ffffff" },
      dropdown: {
        bg: '#ffffff',
        border: '#e5e7eb',
        text: '#111827',
        itemHoverBg: '#f1f5f9', // slate-100
      },
      section: { bg: "#ffffff", border: "#e5e7eb", divider: "#e5e7eb" }
    },
    fonts: { raleway: "Raleway, sans-serif", inter: "Inter, system-ui, sans-serif" },
  },
  dark: {
    colors: {
      page: { 
        bg: "#0b1220", text: "#e5e7eb", 
        primaryBtnBg: "#3b82f6", primaryBtnText: "#ffffff" 
      },
      header: { bg: "#0b1220", text: "#e5e7eb" },
      dropdown: {
        bg: '#1f2937', // slate-800
        border: '#334155', // slate-700
        text: '#e5e7eb',
        itemHoverBg: '#334155', // slate-700
      },
      section: { bg: "#0f172a", border: "#1e293b", divider: "#1e293b" }
    },
    fonts: { raleway: "Raleway, sans-serif", inter: "Inter, system-ui, sans-serif" },
  },
};