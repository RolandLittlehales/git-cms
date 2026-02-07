'use client';

import { createContext, useContext, useState, useLayoutEffect } from 'react';
import type { TenantTheme } from '@git-cms/tenant-config';
import { themeColorsToCssVars } from './tokens';

type ColorMode = 'light' | 'dark';

interface ThemeContextValue {
  colorMode: ColorMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorMode: 'light',
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  theme: TenantTheme;
  children: React.ReactNode;
}

function syncDocumentColorMode(mode: ColorMode): void {
  document.documentElement.setAttribute('data-color-mode', mode);
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const initialMode = mediaQuery.matches ? 'dark' : 'light';
    setColorMode(initialMode);
    syncDocumentColorMode(initialMode);
    setHydrated(true);

    const handleChange = (event: MediaQueryListEvent) => {
      const newMode = event.matches ? 'dark' : 'light';
      setColorMode(newMode);
      syncDocumentColorMode(newMode);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const activeColors =
    colorMode === 'dark' ? theme.darkMode : theme.colors;

  // Defer inline styles until after hydration so the CSS media query dark
  // fallback in global.css isn't overridden by server-rendered light values.
  // useLayoutEffect applies tenant-specific colors before the browser paints.
  const cssVariables = hydrated ? themeColorsToCssVars(activeColors) : {};

  return (
    <ThemeContext value={{ colorMode }}>
      <div
        suppressHydrationWarning
        style={cssVariables as React.CSSProperties}
        className={colorMode === 'dark' ? 'dark' : ''}
      >
        {children}
      </div>
    </ThemeContext>
  );
}
