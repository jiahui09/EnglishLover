import type { ReactNode } from 'react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface ErrorStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: ReactNode;
}

export function ErrorState({
  title = '发生了一些问题',
  description,
  actionLabel = '重试',
  onAction,
  secondaryAction,
}: ErrorStateProps) {
  return (
    <Card variant="outlined" className="border-el-error">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {onAction || secondaryAction ? (
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
            {secondaryAction}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
