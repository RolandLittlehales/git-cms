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

export interface TenantConfig {
  name: string;
  slug: string;
  theme: TenantTheme;
  logo?: string;
  description?: string;
}
