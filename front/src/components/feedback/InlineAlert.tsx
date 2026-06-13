import type { HTMLAttributes, ReactNode } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui';
import { cn } from '@/lib/cn';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const toneBadge: Record<AlertTone, BadgeVariant> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export interface InlineAlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
}

export function InlineAlert({
  tone = 'info',
  title,
  children,
  className,
  ...props
}: InlineAlertProps) {
  return (
    <div
      className={cn('el-inline-alert', `el-inline-alert--${tone}`, className)}
      role="status"
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={toneBadge[tone]} size="sm">
          {tone === 'danger' ? 'error' : tone}
        </Badge>
        <strong>{title}</strong>
      </div>
      {children ? <div className="text-el-subtle mt-2 text-sm">{children}</div> : null}
    </div>
  );
}
