export interface TenantThemeColors {
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
  foreground?: string;
  muted?: string;
  mutedForeground?: string;
}

export interface TenantTheme {
  colors: TenantThemeColors;
  darkMode: TenantThemeColors;
  fontFamily?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface TenantConfig {
  name: string;
  slug: string;
  theme: TenantTheme;
  navigation?: NavigationItem[];
  logo?: string;
  description?: string;
  allowedComponents?: ComponentName[];
}

// Re-export so consumers can use ComponentName without a separate import
export type { ComponentName } from '@git-cms/cms-components';
