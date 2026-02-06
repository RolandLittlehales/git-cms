'use client';

import { createContext, useContext, useState, useEffect } from 'react';
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

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorMode(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (event: MediaQueryListEvent) => {
      setColorMode(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const activeColors =
    colorMode === 'dark' ? theme.darkMode : theme.colors;
  const cssVariables = themeColorsToCssVars(activeColors);

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
