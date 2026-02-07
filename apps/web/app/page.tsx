import Link from 'next/link';
import { getAllTenantIds, getTenantConfig } from '@git-cms/tenant-config';

export default function HomePage() {
  const tenantIds = getAllTenantIds();
  const tenants = tenantIds
    .map((id) => ({ id, config: getTenantConfig(id) }))
    .filter(
      (tenant): tenant is { id: string; config: NonNullable<typeof tenant.config> } =>
        tenant.config !== null
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Git CMS</h1>
      <p className="mb-12 text-lg text-gray-600">
        Select a tenant to view their site
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {tenants.map(({ id, config }) => (
          <Link
            key={id}
            href={`/${id}`}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="mb-1 text-xl font-semibold text-gray-900">
              {config.name}
            </h2>
            {config.description && (
              <p className="text-gray-600">{config.description}</p>
            )}
            <span
              className="mt-3 inline-block rounded-full bg-[var(--badge-color)] px-3 py-1 text-xs font-medium text-white"
              style={{ '--badge-color': config.theme.colors.primary } as React.CSSProperties}
            >
              /{id}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
