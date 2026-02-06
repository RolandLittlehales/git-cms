interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={className}>
      <table className="my-4 w-full border-collapse text-left text-[var(--color-foreground)]">
        {children}
      </table>
    </div>
  );
}
