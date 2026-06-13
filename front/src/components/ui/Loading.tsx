import { cn } from '@/lib/cn';

export interface LoadingProps {
  label?: string;
  variant?: 'inline' | 'block';
  className?: string;
}

export function Loading({ label = '正在加载', variant = 'inline', className }: LoadingProps) {
  if (variant === 'block') {
    return (
      <div className={cn('el-loading-block', className)} role="status" aria-live="polite">
        <span className="el-spinner" aria-hidden="true" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <span className={cn('text-el-subtle inline-flex items-center gap-2', className)} role="status">
      <span className="el-spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
