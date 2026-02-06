import type { TenantThemeColors } from '@git-cms/tenant-config';

const COLOR_KEYS: (keyof TenantThemeColors)[] = [
  'primary',
  'secondary',
  'accent',
  'background',
  'foreground',
  'muted',
  'mutedForeground',
];

function camelToKebab(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function themeColorsToCssVars(
  colors: TenantThemeColors,
  prefix = ''
): Record<string, string> {
  const cssVarPrefix = prefix ? `--${prefix}-` : '--';

  return COLOR_KEYS.reduce<Record<string, string>>((cssVars, colorKey) => {
    const colorValue = colors[colorKey];
    if (colorValue) {
      const propertyName = `${cssVarPrefix}color-${camelToKebab(colorKey)}`;
      return { ...cssVars, [propertyName]: colorValue };
    }
    return cssVars;
  }, {});
}