import React from "react";
import {
  DEFAULT_THEME_NAME,
  THEMES,
  type ThemeName,
  type ThemeTokens,
  resolveThemeName,
  setActiveTheme,
} from "./tokens.js";

const ThemeContext = React.createContext<ThemeTokens>(THEMES[DEFAULT_THEME_NAME]);

export function ThemeProvider({
  children,
  name,
}: {
  children: React.ReactNode;
  name?: string | null;
}): React.ReactElement {
  const theme = THEMES[resolveThemeName(name)];

  // FG/TONE/SURFACE are module-level proxies that read `activeTheme`. Children
  // (history cards, headers, composer) sample them *during render*, so the
  // active theme must flip *before* descendants render — not in an effect
  // (effects run after paint, leaving one frame of the old palette, and if
  // nothing re-renders after the effect the UI stays wrong until restart).
  //
  // setActiveTheme bumps a version so an older restore() no-ops when a newer
  // theme is already active; nested ThemeProviders (wizard preview) still
  // restore their previous palette on unmount via the layout-effect cleanup.
  setActiveTheme(theme);

  React.useLayoutEffect(() => {
    const restore = setActiveTheme(theme);
    return restore;
  }, [theme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useThemeTokens(): ThemeTokens {
  return React.useContext(ThemeContext);
}

export function useTheme(): ThemeTokens {
  return useThemeTokens();
}

export type { ThemeName, ThemeTokens };
