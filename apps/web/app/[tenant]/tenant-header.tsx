import Link from 'next/link';

interface TenantHeaderProps {
  tenantName: string;
  tenantSlug: string;
}

export function TenantHeader({ tenantName, tenantSlug }: TenantHeaderProps) {
  return (
    <header className="border-b border-[var(--color-muted)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          href={`/${tenantSlug}`}
          className="text-xl font-bold text-[var(--color-primary)]"
        >
          {tenantName}
        </Link>
      </div>
    </header>
  );
}
