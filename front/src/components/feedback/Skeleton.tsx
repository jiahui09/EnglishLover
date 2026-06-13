import { cn } from '@/lib/cn';

export interface SkeletonProps {
  lines?: number;
  variant?: 'text' | 'card' | 'avatar';
  className?: string;
}

export function Skeleton({ lines = 3, variant = 'text', className }: SkeletonProps) {
  if (variant === 'avatar') {
    return <span className={cn('el-skeleton el-skeleton--avatar', className)} aria-hidden="true" />;
  }

  if (variant === 'card') {
    return (
      <div className={cn('el-skeleton-card', className)} aria-hidden="true">
        <span className="el-skeleton el-skeleton--title" />
        {Array.from({ length: lines }).map((_, index) => (
          <span key={index} className="el-skeleton el-skeleton--line" />
        ))}
      </div>
    );
  }

  return (
    <span className={cn('grid gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} className="el-skeleton el-skeleton--line" />
      ))}
    </span>
  );
}
