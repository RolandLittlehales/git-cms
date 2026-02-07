import Link from 'next/link';
import type { NavigationItem } from '@git-cms/tenant-config';
import { NavigationDrawer } from './navigation-drawer';

interface TenantHeaderProps {
  tenantName: string;
  tenantSlug: string;
  navigationItems: NavigationItem[];
}

export function TenantHeader({
  tenantName,
  tenantSlug,
  navigationItems,
}: TenantHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-muted)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          href={`/${tenantSlug}`}
          className="text-xl font-bold text-[var(--color-primary)]"
        >
          {tenantName}
        </Link>
        <NavigationDrawer
          navigationItems={navigationItems}
          tenantName={tenantName}
        />
      </div>
    </header>
  );
}
