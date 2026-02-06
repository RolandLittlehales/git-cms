import { clsx } from 'clsx';

interface MediaCardProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
}

export function MediaCard({
  title,
  description,
  image,
  className,
}: MediaCardProps) {
  return (
    <div
      className={clsx(
        'my-4 overflow-hidden rounded-lg border border-[var(--color-muted)] bg-[var(--color-background)] shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      {image && (
        <div className="h-48 bg-[var(--color-muted)]">
          <div className="flex h-full items-center justify-center text-[var(--color-muted-foreground)]">
            {title}
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
          {title}
        </h3>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
}
