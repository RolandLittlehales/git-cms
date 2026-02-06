import Link from 'next/link';

export default function TenantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-[var(--color-foreground)]">404</h1>
      <p className="mb-8 text-lg text-[var(--color-muted-foreground)]">Page not found</p>
      <Link href="/" className="text-[var(--color-primary)] underline hover:opacity-80">
        Back to home
      </Link>
    </div>
  );
}
