'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TenantError({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-[var(--color-foreground)]">
        Something went wrong
      </h1>
      <p className="mb-8 text-lg text-[var(--color-muted-foreground)]">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-white transition-opacity hover:opacity-80"
      >
        Try again
      </button>
    </div>
  );
}
