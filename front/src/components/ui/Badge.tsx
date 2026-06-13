import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function Badge({ variant = 'neutral', size = 'md', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('el-badge', `el-badge--${variant}`, `el-badge--${size}`, className)}
      {...props}
    />
  );
}
