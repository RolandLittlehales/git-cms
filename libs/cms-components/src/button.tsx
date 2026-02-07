import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      intent: {
        primary:
          'bg-[var(--color-primary)] text-white hover:opacity-90 focus:ring-[var(--color-primary)]',
        secondary:
          'bg-[var(--color-secondary)] text-white hover:opacity-90 focus:ring-[var(--color-secondary)]',
        outline:
          'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
);

const isAbsoluteUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://');

type ButtonProps = VariantProps<typeof buttonVariants> & {
  label: string;
  url: string;
  className?: string;
};

export function Button({ intent, size, label, url = '#', className }: ButtonProps) {
  const classes = clsx(buttonVariants({ intent, size }), className);

  if (isAbsoluteUrl(url)) {
    return (
      <a
        href={url}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
      >
        {label}
      </a>
    );
  }

  return (
    <a href={url} className={classes}>
      {label}
    </a>
  );
}
