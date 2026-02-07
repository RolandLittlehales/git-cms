import { notFound } from 'next/navigation';
import { getTenantConfig } from '@git-cms/tenant-config';
import { ThemeProvider } from '@git-cms/theme';
import { TenantHeader } from './tenant-header';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  const tenantConfig = getTenantConfig(tenant);

  if (!tenantConfig) {
    notFound();
  }

  const navigationItems = tenantConfig.navigation ?? [
    { label: 'Home', href: `/${tenant}` },
  ];

  return (
    <ThemeProvider theme={tenantConfig.theme}>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <TenantHeader
          tenantName={tenantConfig.name}
          tenantSlug={tenant}
          navigationItems={navigationItems}
        />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
