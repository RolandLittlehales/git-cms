import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const calloutVariants = cva('rounded-lg border-l-4 p-4 my-4', {
  variants: {
    intent: {
      info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
      success:
        'border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100',
      warning:
        'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
      error:
        'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100',
    },
  },
  defaultVariants: {
    intent: 'info',
  },
});

type CalloutProps = VariantProps<typeof calloutVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function Callout({ intent, children, className }: CalloutProps) {
  return (
    <div className={clsx(calloutVariants({ intent }), className)}>
      {children}
    </div>
  );
}
